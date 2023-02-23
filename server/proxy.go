package server

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

// https://blog.joshsoftware.com/2021/05/25/simple-and-powerful-reverseproxy-in-go/
// NewProxy takes target host and creates a reverse proxy
func NewProxy(targetHost string) (*httputil.ReverseProxy, *url.URL, error) {
	url, err := url.Parse(targetHost)
	if err != nil {
		return nil, nil, err
	}

	proxy := httputil.NewSingleHostReverseProxy(url)

	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		modifyRequest(req)
	}

	proxy.ModifyResponse = modifyResponse()
	proxy.ErrorHandler = errorHandler()
	return proxy, url, nil
}

func modifyRequest(req *http.Request) {
	// req.Header.Set("X-Proxy", "Simple-Reverse-Proxy")
	// "sec-fetch-dest":"empty",
	// "sec-fetch-mode":"cors",
	req.Header.Set("Sec-Fetch-Site", "cross-site")
	reqDump, err := httputil.DumpRequestOut(req, true)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("REQUEST:\n%s\n\n", string(reqDump))
}

func errorHandler() func(http.ResponseWriter, *http.Request, error) {
	return func(w http.ResponseWriter, req *http.Request, err error) {
		fmt.Printf("Got error while modifying response: %v \n", err)
		return
	}
}

func modifyResponse() func(*http.Response) error {
	return func(resp *http.Response) error {
		// Pocketbase already adds Allow-Origin * header, so this would append to the header and corrupt it.
		// resp.Header.Set("Access-Control-Allow-Origin", "*")
		resp.Header.Del("Access-Control-Allow-Origin")
		resp.Header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		resp.Header.Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		respDump, err := httputil.DumpResponse(resp, true)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("RESPONSE:\n%s\n\n", string(respDump))

		// return errors.New("response body is invalid")
		return nil
	}
}

// ProxyRequestHandler handles the http request using proxy
func ProxyRequestHandler(proxy *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	}
}

func AddProxyRequests(app core.App, e *core.ServeEvent) {
	// add POST /api/connect/token to router which reverse proxies to https://identity.nexar.com/connect/token
	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/api/octopart/connect/token",
		Handler: func(c echo.Context) error {
			r := c.Request()
			Host := "https://identity.nexar.com"
			proxy, remote, err := NewProxy(Host)
			if err != nil {
				panic(err)
			}
			// req.URL.Scheme = "https"
			r.Host = remote.Host
			r.URL.Path = strings.TrimPrefix(r.URL.Path, "/api/octopart")

			handler := ProxyRequestHandler(proxy)
			handler(c.Response().Writer, r)
			return nil
		},
		Middlewares: []echo.MiddlewareFunc{
			apis.RequireAdminOrRecordAuth(),
		},
	})

	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/api/octopart/graphql",
		Handler: func(c echo.Context) error {
			r := c.Request()
			Host := "https://api.nexar.com"
			proxy, remote, err := NewProxy(Host)
			if err != nil {
				panic(err)
			}
			// req.URL.Scheme = "https"
			r.Host = remote.Host
			r.URL.Path = strings.TrimPrefix(r.URL.Path, "/api/octopart")

			handler := ProxyRequestHandler(proxy)
			handler(c.Response().Writer, r)
			return nil
		},
		Middlewares: []echo.MiddlewareFunc{
			apis.RequireAdminOrRecordAuth(),
		},
	})
}
