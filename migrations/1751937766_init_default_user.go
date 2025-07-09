package migrations

import (
	"fmt"
	"os"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// https://pocketbase.io/docs/go-migrations/#0-register-the-migrate-command
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		record := core.NewRecord(users)

		record.Set("email", os.Getenv("PARTMAN_USER_EMAIL"))
		record.Set("password", os.Getenv("PARTMAN_USER_PASSWORD"))
		record.Set("username", os.Getenv("PARTMAN_USER_USERNAME"))

		// log
		fmt.Printf("Creating default user: %s\n", record.GetString("username"))

		return app.Save(record)

	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
