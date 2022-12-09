package server

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/migrations/logs"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/migrate"
)

type migrationsConnection struct {
	DB             *dbx.DB
	MigrationsList migrate.MigrationsList
}

func RunInitMigrations(app core.App) error {
	connections := []migrationsConnection{
		{
			DB:             app.DB(),
			MigrationsList: migrations.AppMigrations,
		},
		{
			DB:             app.LogsDB(),
			MigrationsList: logs.LogsMigrations,
		},
	}

	for _, c := range connections {
		runner, err := migrate.NewRunner(c.DB, c.MigrationsList)
		if err != nil {
			return err
		}

		if _, err := runner.Up(); err != nil {
			return err
		}
	}

	return nil
}

// function that creates a new collection
// https://github.com/pocketbase/pocketbase/blob/b9922e484320a91a809e663dd1ee1a94ddc30a97/forms/collections_import_test.go
func TryImportCollectionsFromJSON(app core.App, schemaJSONString string) error {
	
	form := forms.NewCollectionsImport(app)
	
    err := json.Unmarshal([]byte(schemaJSONString), form)
    if err != nil {
		fmt.Println("Error when unmarshalling JSON: ", err)
        log.Fatal("Error during Unmarshal(): Failed to load form data: ", err)
		return err
    }
	err = form.Submit()
	if err != nil {
		fmt.Println("Error when submitting form: ", err)
		return err
	}
	return nil
}

// This method doesn't perform validations on the imported collections data!
// inspired from https://github.com/faterium/faterium-server/blob/main/core/app.go
// https://github.com/pocketbase/pocketbase/blob/b8cd686b320dbac64a9a482ff738f8f586dc3af2/daos/collection.go
func TryImportCollectionsFromJSON2(app core.App, schemaJSONString string) error {

	var collections []*models.Collection
	err := json.Unmarshal([]byte(schemaJSONString), &collections)
	if err != nil {
		log.Print("collections is invalid, proceeding without import")
		return err
	} 
	err = app.Dao().ImportCollections(collections, true, nil)
	if err != nil {
		log.Print("error importing collections: ", err)
		return err
	}
	return nil
}