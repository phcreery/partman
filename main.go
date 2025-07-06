package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/fatih/color"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "phcreery/partman/migrations"
	"phcreery/partman/server"
)

//go:embed package.json
var f embed.FS

func GetVersion() string {
	// Set the version from package.json
	type PackageJSON struct {
		Version string `json:"version"`
	}
	content, err := f.ReadFile("package.json")
	if err != nil {
		fmt.Println(err)
	}
	var packageJSON PackageJSON
	json.Unmarshal(content, &packageJSON)
	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}
	var Version = packageJSON.Version
	return Version
}

//go:embed all:dist-ui
//go:embed dist-ui/*
var distDir embed.FS

// DistDirFS contains the embedded dist-ui directory files (without the "dist-ui" prefix)
var DistDirFS = echo.MustSubFS(distDir, "dist-ui")

const uiPath = "/" // trailedAdminPath

// bindStaticAdminUI registers the endpoints that serves the static admin UI.
// https://github.com/pocketbase/pocketbase/apis/base.go
func bindStaticAdminUI(app core.App, e *core.ServeEvent) error {
	// serves static files from the /dist directory
	// (similar to echo.StaticFS but with gzip middleware enabled)
	e.Router.GET(
		uiPath+"*",
		apis.Static(DistDirFS, false),
		// middleware.Gzip(),
	)

	return nil
}

func main() {

	var Version = GetVersion()

	app := pocketbase.New()

	app.RootCmd.Use = filepath.Base(os.Args[0]) // "partman"
	app.RootCmd.Short = "partman CLI"
	app.RootCmd.Version = Version

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {

		// Authentication middleware
		// e.Router.Bind(apis.RequireAuth())

		server.AddProxyRequests(app, se)

		server.AddDashboardRequests(app, se, Version)

		server.AddProjectBuildRoute(app, se)

		server.AddImportComponentsRoute(app, se)

		server.AddImportProjectComponentsRoute(app, se)

		bindStaticAdminUI(app, se)

		fmt.Printf("── Web:       %s\n", color.CyanString("http://%s/", se.Server.Addr))

		return se.Next()
	})

	server.ComponentLogsHook(app)

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: true, // auto creates migration files when making collection changes
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
