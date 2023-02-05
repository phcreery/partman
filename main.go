package main

import (
	"embed"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/spf13/cobra"

	"phcreery/partman/server"
)

// Version of PocketBase
var Version = "(untracked)"

//go:embed all:dist-ui
//go:embed dist-ui/*
var distDir embed.FS

// DistDirFS contains the embedded dist-ui directory files (without the "dist-ui" prefix)
var DistDirFS = echo.MustSubFS(distDir, "dist-ui")

const uiPath = "/" // trailedAdminPath

// bindStaticAdminUI registers the endpoints that serves the static admin UI.
// https://github.com/pocketbase/pocketbase/apis/base.go
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

	app.RootCmd.Use = filepath.Base(os.Args[0]) // "partman"
	app.RootCmd.Short = "partman CLI"
	app.RootCmd.Version = Version

	app.RootCmd.AddCommand(&cobra.Command{
		Use:   "init",
		Short: "Initialize the database and create the schema (WARNING: this will delete all data in the database)",
		Run: func(cmd *cobra.Command, args []string) {
			// app.IsBootstrapped()
      err := app.Bootstrap()
			if err != nil {
				log.Fatal(err)
				fmt.Println("Error Bootstrapping: ", err)
			}

			// ensure that the latest migrations are applied before starting the server
			err = server.RunInitMigrations(app)
			if err != nil {
				log.Fatal(err)
				fmt.Println("Error Running Migrations: ", err)
			}

			// app.RefreshSettings()
			
			err = server.TryImportCollectionsFromJSON(app, server.SchemaAsForm)
			// err = server.TryImportCollectionsFromJSON2(app, server.Schema)
			if err != nil {
				log.Fatal(err)
				fmt.Println("Error Importing Collections: ", err)
			} else {
				fmt.Println("Collections Imported")
			}
		},
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		
		server.AddProxyRequests(app, e)

		server.AddDashboardRequests(app, e)

		bindStaticAdminUI(app, e)

		return nil
	})

	server.ComponentLogsHook(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
