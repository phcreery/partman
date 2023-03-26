package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/apis"
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
				// return c.String(http.StatusBadRequest, "cant convert build_quantity to int")
				return apis.NewBadRequestError("cant convert build_quantity to int", err)
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
					return apis.NewNotFoundError("can't find component in project_components", err)
					// continue
				}
				component_id := project_component_record.GetString("component")
				component_quantity_in_project := project_component_record.GetInt("quantity")

				component_record, err := app.Dao().FindRecordById("components", component_id)
				if err != nil {
					fmt.Println(err)
					// return c.String(http.StatusBadRequest, "can't find project_component in components")
					return apis.NewNotFoundError("can't find project_component in components", err)
					// continue
				}
				component_record_stock := component_record.GetInt("stock")
				new_stock := component_record_stock - (build_quantity_int * component_quantity_in_project)
				component_record.Set("stock", new_stock)
				err = app.Dao().SaveRecord(component_record)

				if err != nil {
					fmt.Println(err)
					// return c.String(http.StatusBadRequest, "cant save component record")
					return apis.NewBadRequestError("cant save component record", err)
					// continue
				}
			}

			return c.String(http.StatusOK, "ok")
		},
		Middlewares: []echo.MiddlewareFunc{
			// apis.RequireAdminOrUserAuth(),
		},
	})
}
