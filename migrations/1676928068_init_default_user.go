package migrations

import (
	"fmt"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		// add up queries...

		dao := daos.New(db)

		// create a default user
		var name string
		var username string
		var password string

		fmt.Println("Enter partman UI Name: ")
		fmt.Scanln(&name)
		fmt.Println("Enter partman UI Username: ")
		fmt.Scanln(&username)
		fmt.Println("Enter partman UI Password: ")
		fmt.Scanln(&password)

		collection, err := dao.FindCollectionByNameOrId("users")
		if err != nil {
			fmt.Println("Error finding Users collection: ", err)
			return err
		}

		record := models.NewRecord(collection)
		// hash the password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 13)
		if err != nil {
			fmt.Println("Error creating password hash: ", err)
			return err
		}

		record.Set("passwordHash", hashedPassword)
		record.Set("username", username)
		record.Set("name", name)

		if err := dao.SaveRecord(record); err != nil {
			fmt.Println("Error creating default user: ", err)
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		// add down queries...

		return nil
	})
}
