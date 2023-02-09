import { reactive, toRefs, computed } from "vue";
import { Component } from "@/api/interface";

export interface MergeColumnOptions {
  prop: keyof Component.ResGetComponentRecord;
  label: string;
  single?: boolean;
  defaultBoth?: boolean;
  required?: boolean;
  checkedLeft?: boolean;
  checkedRight?: boolean;
  checkLeft?: (e: Event) => void;
  checkRight?: (e: Event) => void;
}

interface MergerStateProps {
  mergeColumns: MergeColumnOptions[];
  leftComponent: Component.ResGetComponentRecord | undefined;
  rightComponent: Component.ResGetComponentRecord | undefined;
}

export const useMerger = (mergeColumnOptions: MergeColumnOptions[]) => {
  const state = reactive<MergerStateProps>({
    mergeColumns: JSON.parse(JSON.stringify(mergeColumnOptions)), // []
    leftComponent: undefined,
    rightComponent: undefined
  });

  const setLeftComponent = (component: Component.ResGetComponentRecord) => {
    state.leftComponent = component;
    intelligentCheck();
  };

  const setRightComponent = (component: Component.ResGetComponentRecord) => {
    state.rightComponent = component;
    intelligentCheck();
  };

  const intelligentCheck = () => {
    state.mergeColumns.map((column: MergeColumnOptions) => {
      if (column.defaultBoth) {
        // check both stock to add quantities together
        column.checkedLeft = true;
        column.checkedRight = true;
      } else if ((state.rightComponent && !state.leftComponent) || (state.leftComponent && !state.leftComponent[column.prop])) {
        // use second component value
        column.checkedLeft = false;
        column.checkedRight = true;
      } else if ((state.leftComponent && !state.rightComponent) || (state.rightComponent && !state.rightComponent[column.prop])) {
        // use first component value
        column.checkedLeft = true;
        column.checkedRight = false;
      } else {
        // use second component value
        column.checkedLeft = false;
        column.checkedRight = true;
      }
      column.checkLeft = (e: Event) => {
        column.single && e ? (column.checkedRight = false) : "";
        !e && column.required ? (column.checkedRight = true) : "";
      };
      column.checkRight = (e: Event) => {
        column.single && e ? (column.checkedLeft = false) : "";
        !e && column.required ? (column.checkedLeft = true) : "";
      };
    });
  };

  const mergedComponent = computed(() => {
    let mergedComponent: Partial<Component.ResGetComponentRecord> = {};
    mergedComponent.id = state.leftComponent?.id;
    for (const column of state.mergeColumns) {
      let leftValue = state.leftComponent![column.prop];
      let rightValue = state.rightComponent![column.prop];
      if (column.checkedLeft && column.checkedRight) {
        if (typeof leftValue === "string") {
          Object.assign(mergedComponent, {
            [column.prop]: leftValue + ", " + rightValue
          });
        } else if (typeof leftValue === "number") {
          Object.assign(mergedComponent, {
            [column.prop]: Number(leftValue) + Number(rightValue)
          });
        }
      } else if (column.checkedLeft) {
        Object.assign(mergedComponent, { [column.prop]: leftValue });
      } else if (column.checkedRight) {
        Object.assign(mergedComponent, { [column.prop]: rightValue });
      }
    }
    return mergedComponent;
  });

  return {
    ...toRefs(state),
    setLeftComponent,
    setRightComponent,
    intelligentCheck,
    mergedComponent
  };
};
