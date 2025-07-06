package server

import (
	"fmt"
	"net/http"
	"strconv"

	// "github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func AddProjectBuildRoute(app core.App, se *core.ServeEvent) {

	se.Router.POST("/api/custom/projectbuilds/new", func(e *core.RequestEvent) error {

		// projectID := e.FormValue("project_id")
		// build_quantity := e.FormValue("qty")

		data := struct {
			ProjectID     string `json:"project_id" form:"project_id"`
			BuildQuantity string `json:"build_quantity" form:"build_quantity"`
		}{}
		if err := e.BindBody(&data); err != nil {
			return e.BadRequestError("Failed to read request data", err)
		}

		build_quantity_int, err := strconv.Atoi(data.BuildQuantity)
		if err != nil {
			fmt.Println(err)
			// return c.String(http.StatusBadRequest, "cant convert build_quantity to int")
			return apis.NewBadRequestError("cant convert build_quantity to int", err)
		}

		project, err := app.FindRecordById("projects", data.ProjectID)
		project_components := project.GetStringSlice("components")

		// loop though each component and update the stock
		for _, project_component := range project_components {
			// get the component record
			project_component_record, err := app.FindRecordById("project_components", project_component)
			if err != nil {
				fmt.Println(err)
				// return c.String(http.StatusBadRequest, "can't find component in project_components")
				return apis.NewNotFoundError("can't find component in project_components", err)
				// continue
			}
			component_id := project_component_record.GetString("component")
			component_quantity_in_project := project_component_record.GetInt("quantity")

			component_record, err := app.FindRecordById("components", component_id)
			if err != nil {
				fmt.Println(err)
				// return c.String(http.StatusBadRequest, "can't find project_component in components")
				return apis.NewNotFoundError("can't find project_component in components", err)
				// continue
			}
			component_record_stock := component_record.GetInt("stock")
			new_stock := component_record_stock - (build_quantity_int * component_quantity_in_project)
			component_record.Set("stock", new_stock)
			err = app.Save(component_record)

			if err != nil {
				fmt.Println(err)
				// return c.String(http.StatusBadRequest, "cant save component record")
				return apis.NewBadRequestError("cant save component record", err)
				// continue
			}
		}

		return e.String(http.StatusOK, "ok")
	},
	).Bind(apis.RequireAuth())
}
