package main

import (
	"embed"
	"log"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	"phcreery/partman/server"
)

//go:embed all:dist-ui
//go:embed dist-ui/*
var distDir embed.FS

// DistDirFS contains the embedded dist directory files (without the "dist" prefix)
var DistDirFS = echo.MustSubFS(distDir, "dist-ui")
// var DistDirFS = os.DirFS(publicDirFlag)

const uiPath = "/" // trailedAdminPath

// bindStaticAdminUI registers the endpoints that serves the static admin UI.
func bindStaticAdminUI(app core.App, e *core.ServeEvent) error {

	// redirect to trailing slash to ensure that relative urls will still work properly
	// e.Router.GET(
	// 	strings.TrimRight(uiPath, "/"),
	// 	func(c echo.Context) error {
	// 		return c.Redirect(http.StatusTemporaryRedirect, uiPath)
	// 	},
	// )

	// serves static files from the /dist directory
	// (similar to echo.StaticFS but with gzip middleware enabled)
	e.Router.GET(
		uiPath+"*",
		apis.StaticDirectoryHandler(DistDirFS, false),
		// middleware.Gzip(),
	)

	return nil
}

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		
		server.AddProxyRequests(app, e)

		server.AddDashboardRequests(app, e)

		bindStaticAdminUI(app, e)

		return nil
	})

	// app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordEvent) error {
	// 	server.HookComponentLogs(app, e)
	// })

	app.OnModelBeforeCreate().Add(func(e *core.ModelEvent) error {
        log.Println(e.Model.TableName())
		server.HookComponentLogs(app, e)
        return nil
    })

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
