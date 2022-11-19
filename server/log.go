package server

import (
	"github.com/pocketbase/pocketbase/core"
)

func HookComponentLogs(app core.App, e *core.ModelEvent) {

	// if e.Model.TableName() == "components" {
	// 	// e.Record.Set("status", "pending")

	// 	collection, err := app.Dao().FindCollectionById("component_logs")
	// 	if err != nil {
	// 		return err
	// 	}

	// 	record := models.NewRecord(collection)

	// 	// with data validation
	// 	// form := forms.NewRecordUpsert(app, record)
	// 	// or form.LoadRequest(r, "")
	// 	// form.LoadData(map[string]any{
	// 	// 	"title": "Lorem ipsum",
	// 	// 	"active": true,
	// 	// 	"someOtherField": 123,
	// 	// })

	// 	// validate and submit (internally it calls app.Dao().SaveRecord(record) in a transaction)
	// 	// if err := form.Submit(); err != nil {
	// 	// 	// print error
	// 	// 	fmt.Println(err)
	// 	// 	// return err
	// 	// 	return
	// 	// }

	// 	// without data validation
	// 	record.Set("title", "Lorem ipsum")
	// 	record.Set("active", true)
	// 	record.Set("someOtherField", 123)

	// 	if err := app.Dao().SaveRecord(record); err != nil {
	// 		// print error
	// 		fmt.Println(err)
	// 		// return err
	// 		return
	// 	}

	// 	// the below WILL NOT fire the OnModelBeforeUpdate and OnModelAfterUpdate hooks
	// 	// dao := daos.New(app.Dao().DB())
	// 	// dao.SaveRecord(record)
	// }
	
	
}
