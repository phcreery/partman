package server

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
)

// function that creates a new collection
func CreateCollectionsFromJSON(app core.App, schemaJSONString string) error {
	
	form := forms.NewCollectionsImport(app)
	
    err := json.Unmarshal([]byte(schemaJSONString), form)
    if err != nil {
		fmt.Println("Error when unmarshalling JSON: ", err)
        log.Fatal("Error during Unmarshal(): Failed to load form data: ", err)
    }
	// fmt.Println("form: ", form)

	err = form.Submit()

	if err != nil {
		fmt.Println("Error when submitting form: ", err)
	}
	
	return nil
}
