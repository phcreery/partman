package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/core"
)

func AddProjectBuildRoute(app core.App, e *core.ServeEvent) {

	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/api/custom/projectbuilds/new",
		Handler: func(c echo.Context) error {

			projectID := c.FormValue("project_id")
			build_quantity := c.FormValue("qty")
			build_quantity_int, err := strconv.Atoi(build_quantity)
			if err != nil {
				fmt.Println(err)
				return c.String(http.StatusBadRequest, "cant convert build_quantity to int")
			}

			project, err := app.Dao().FindRecordById("projects", projectID)
			project_components := project.GetStringSlice("components")

			// loop though each component and update the stock
			for _, project_component := range project_components {
				// get the component record
				project_component_record, err := app.Dao().FindRecordById("project_components", project_component)
				if err != nil {
					fmt.Println(err)
					// return c.String(http.StatusBadRequest, "can't find component in project_components")
					continue
				}
				component_id := project_component_record.GetString("component")
				component_quantity_in_project := project_component_record.GetInt("quantity")

				component_record, err := app.Dao().FindRecordById("components", component_id)
				if err != nil {
					fmt.Println(err)
					// return c.String(http.StatusBadRequest, "can't find project_component in components")
					continue
				}
				component_record_stock := component_record.GetInt("stock")
				new_stock := component_record_stock - (build_quantity_int * component_quantity_in_project)
				component_record.Set("stock", new_stock)
				err = app.Dao().SaveRecord(component_record)

				if err != nil {
					fmt.Println(err)
					// return c.String(http.StatusBadRequest, "cant save component record")
					continue
				}
			}

			return c.String(http.StatusOK, "ok")
		},
		Middlewares: []echo.MiddlewareFunc{
			// apis.RequireAdminOrUserAuth(),
		},
	})
}
