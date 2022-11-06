import{d as $,a as R,r as d,U as Q,b as p,a4 as K,c as _,e as A,f as a,w as o,V as B,W as G,v as y,j as P,g as q,F as X,N as Z,h as c,Y as ee,C as F,a5 as te,_ as J,l as b,E as W,I as z,B as L,D as M,a8 as ae,a9 as oe}from"./index-411664c1.js";import{P as le,u as O}from"./index-7941d293.js";import{I as re,J as ne,u as se}from"./index-543d9bc1.js";import{A as ie,p as ce,c as pe,u as ue,B as de,C as me,D as _e,E as fe,F as ve,G as we,H as be,I as Ce,J as ye}from"./components-bdf98b0c.js";import{P as De}from"./index-1607a68b.js";import{C as he}from"./ComponentDrawer-f83f9e0d.js";import"./util-006b265b.js";import"./index-6bf0d9f6.js";import"./FootprintDrawer-bb92f8f3.js";import"./StorageDrawer-60d89e19.js";const Pe={class:"form-item-with-buttons"},je={style:{float:"left"}},ge={style:{float:"right",color:"var(--el-text-color-secondary)","font-size":"13px"}},ke=b("Cancel"),Ve=b("Save"),xe=$({name:"UserDrawer"}),Ue=$({...xe,setup(H,{expose:w}){const j=R({name:[{required:!0,message:"Please enter the project name",trigger:"change"}],description:[{required:!1,message:"Please enter project description",trigger:"change"}]}),i=d(!1),e=d({isView:!1,title:""}),T=s=>{e.value=s,i.value=!0},g=d(),N=()=>{g.value.validate(async s=>{if(!!s)try{await e.value.apiUrl(e.value.rowData),W.success({message:`${e.value.title} project success!`}),e.value.updateTable(),i.value=!1}catch(r){}})},C=(s,r)=>s.length>r?s.substring(0,r)+"...":this,n=d(),D=()=>ie().then(s=>n.value=s.data);Q(i,s=>{s&&D()});const k=d(),V=(s,r={})=>{let f={title:s,rowData:{...r},isView:s==="View",apiUrl:s==="New"?ce:s==="Edit"?pe:"",updateTable:D};k.value.acceptParams(f)};return w({acceptParams:T}),(s,r)=>{const f=p("el-option"),E=p("el-select"),h=p("el-button"),S=p("el-button-group"),I=p("el-space"),t=p("el-form-item"),m=p("el-input-number"),u=p("el-form"),x=p("el-drawer"),U=K("loading");return _(),A("div",null,[a(x,{modelValue:i.value,"onUpdate:modelValue":r[5]||(r[5]=l=>i.value=l),"destroy-on-close":!0,size:"600px",title:`${e.value.title} Project Component`},{footer:o(()=>[a(h,{onClick:r[4]||(r[4]=l=>i.value=!1)},{default:o(()=>[ke]),_:1}),B(a(h,{type:"primary",onClick:N},{default:o(()=>[Ve]),_:1},512),[[G,!e.value.isView]])]),default:o(()=>[a(u,{ref_key:"ruleFormRef",ref:g,rules:j,disabled:e.value.isView,model:e.value.rowData,"label-width":"130px","label-suffix":" :","append-to-body":!0},{default:o(()=>[B((_(),y(t,{label:"MPN",prop:"id"},{default:o(()=>[P(` <el-input
						v-model="drawerData.rowData!.mpn"
						placeholder="Please fill in the component"
						clearable
						:rows="4"
						type="textarea"
						autosize
					>
					</el-input> `),q("div",Pe,[a(I,null,{default:o(()=>[a(E,{modelValue:e.value.rowData.id,"onUpdate:modelValue":r[0]||(r[0]=l=>e.value.rowData.id=l),placeholder:"",clearable:"",filterable:"",style:{width:"max-content"}},{default:o(()=>[(_(!0),A(X,null,Z(n.value,l=>(_(),y(f,{key:l.id,label:l.mpn,value:l.id},{default:o(()=>[q("span",je,z(l.mpn),1),q("span",ge,z(C(l.description,25)),1)]),_:2},1032,["label","value"]))),128))]),_:1},8,["modelValue"]),a(S,null,{default:o(()=>[a(h,{icon:c(ee),onClick:D},null,8,["icon"]),a(h,{icon:c(F),disabled:!e.value.rowData.id||e.value.rowData.id==="",onClick:r[1]||(r[1]=l=>{var v;return V("Edit",(v=n.value)==null?void 0:v.find(Y=>Y.id===e.value.rowData.id))})},null,8,["icon","disabled"]),a(h,{icon:c(te),onClick:r[2]||(r[2]=l=>V("New"))},null,8,["icon"])]),_:1})]),_:1})])]),_:1})),[[U,n.value===void 0]]),a(t,{label:"Quantity",prop:"_quantityUsed"},{default:o(()=>[a(m,{modelValue:e.value.rowData._quantityUsed,"onUpdate:modelValue":r[3]||(r[3]=l=>e.value.rowData._quantityUsed=l)},null,8,["modelValue"])]),_:1})]),_:1},8,["rules","disabled","model"])]),_:1},8,["modelValue","title"]),a(he,{ref_key:"drawerRefCreateComponent",ref:k},null,512)])}}});var $e=J(Ue,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/projects/components/ProjectComponentDrawer.vue"]]);const Te=b("Cancel"),Ne=b("Save"),Ee=$({name:"UserDrawer"}),Se=$({...Ee,setup(H,{expose:w}){const j=R({name:[{required:!0,message:"Please enter the project name",trigger:"change"}],description:[{required:!1,message:"Please enter project description",trigger:"change"}]}),i=d(!1),e=d({isView:!1,title:""}),T=C=>{e.value=C,i.value=!0},g=d(),N=()=>{g.value.validate(async C=>{if(!!C)try{await e.value.apiUrl(e.value.rowData),W.success({message:`${e.value.title} project success!`}),e.value.updateTable(),i.value=!1}catch(n){}})};return Q(i,C=>{}),w({acceptParams:T}),(C,n)=>{const D=p("el-input"),k=p("el-form-item"),V=p("el-form"),s=p("el-button"),r=p("el-drawer");return _(),A("div",null,[a(r,{modelValue:i.value,"onUpdate:modelValue":n[3]||(n[3]=f=>i.value=f),"destroy-on-close":!0,size:"600px",title:`${e.value.title} Project`},{footer:o(()=>[a(s,{onClick:n[2]||(n[2]=f=>i.value=!1)},{default:o(()=>[Te]),_:1}),B(a(s,{type:"primary",onClick:N},{default:o(()=>[Ne]),_:1},512),[[G,!e.value.isView]])]),default:o(()=>[a(V,{ref_key:"ruleFormRef",ref:g,rules:j,disabled:e.value.isView,model:e.value.rowData,"label-width":"130px","label-suffix":" :","append-to-body":!0},{default:o(()=>[a(k,{label:"Name",prop:"name"},{default:o(()=>[a(D,{modelValue:e.value.rowData.name,"onUpdate:modelValue":n[0]||(n[0]=f=>e.value.rowData.name=f),placeholder:"Please fill in the project",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1}),a(k,{label:"Description",prop:"description"},{default:o(()=>[a(D,{modelValue:e.value.rowData.description,"onUpdate:modelValue":n[1]||(n[1]=f=>e.value.rowData.description=f),placeholder:"Please fill in the project description",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1})]),_:1},8,["rules","disabled","model"])]),_:1},8,["modelValue","title"])])}}});var Ie=J(Se,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/projects/components/ProjectDrawer.vue"]]);const qe={class:"table-box"},Re={class:"table-box"},Ae=b(" Add Component "),Be=b(" Delete "),Fe=b("Import BOM"),ze=b("Export"),Je=b("Edit"),He=$({name:"useComponent"});var Le=$({...He,setup(H){const w=d(),j=d(),i=R({expand:"components",projectID:""}),e=R({}),T=d(),g=t=>(T.value=t,t),N=t=>({datalist:t.items,total:t.totalItems,pageNum:t.page,pageSize:t.perPage}),C=t=>{i.projectID=t.id},{BUTTONS:n}=ue(),D=[{type:"selection",width:40,fixed:"left"},{prop:"_quantityUsed",label:"Qty.",width:80,sortable:!0},{prop:"mpn",label:"MPN",width:130,sortable:!0,search:!0,searchType:"text"},{prop:"description",label:"Description",search:!0,searchType:"text"},{prop:"action",label:"Action",width:100,fixed:"right"}],k=async t=>{await O(_e,{projectID:String(i.projectID),ids:t},"Remove the selected components(s) from project"),w.value.refresh()},V=async t=>{await O(ye,{ids:t},"Delete the selected projects(s)"),j.value.refresh()},s=async()=>{var U;let t=i.projectID,m=await fe({filter:w.value.searchParam,projectID:(U=i.projectID)!=null?U:""}),u=w.value.tableColumns.map(l=>{var v;return(v=l.prop)!=null?v:""}),x=ne(m,u);se(()=>x,`${t}_project_component_list`,{},!0,".csv")},r=d(),f=()=>{let t={title:"component",getTableList:w.value.refresh};r.value.acceptParams(t)},E=d(),h=(t,m={})=>{let u={title:t,rowData:{_ofProjectID:i.projectID,id:m.id,_quantityUsed:m._quantityUsed},isView:t==="View",apiUrl:t==="New"?ve:t==="Edit"?we:"",updateTable:w.value.refresh};E.value.acceptParams(u)},S=d(),I=(t,m={})=>{let u={title:t,rowData:{...m},isView:t==="View",apiUrl:t==="New"?be:t==="Edit"?Ce:"",updateTable:j.value.refresh};S.value.acceptParams(u)};return(t,m)=>{const u=p("el-button"),x=p("el-col"),U=p("el-row");return _(),A("div",qe,[a(U,{gutter:20},{default:o(()=>[a(x,{span:6},{default:o(()=>[a(De,{ref_key:"proTree",ref:j,requestApi:c(de),initParam:e,dataCallback:g,onHandleNodeClick:C,showAll:!1},{treeHeader:o(l=>[c(n).add?(_(),y(u,{key:0,type:"primary",icon:c(L),onClick:m[0]||(m[0]=v=>I("New"))},null,8,["icon"])):P("v-if",!0),c(n).edit?(_(),y(u,{key:1,icon:c(F),disabled:l.row.id==="",onClick:v=>I("Edit",l.row)},null,8,["icon","disabled","onClick"])):P("v-if",!0),c(n).delete?(_(),y(u,{key:2,type:"danger",icon:c(M),plain:"",disabled:l.row.id==="",onClick:v=>V([l.row.id])},null,8,["icon","disabled","onClick"])):P("v-if",!0)]),_:1},8,["requestApi","initParam"])]),_:1}),a(x,{span:18},{default:o(()=>[q("div",Re,[a(le,{ref_key:"proTable",ref:w,columns:D,requestApi:c(me),initParam:i,isPageable:!0,dataCallback:N},{tableHeader:o(l=>[c(n).add?(_(),y(u,{key:0,type:"primary",icon:c(L),onClick:m[1]||(m[1]=v=>h("New"))},{default:o(()=>[Ae]),_:1},8,["icon"])):P("v-if",!0),c(n).delete?(_(),y(u,{key:1,type:"danger",icon:c(M),plain:"",disabled:!l.isSelected,onClick:v=>k(l.ids)},{default:o(()=>[Be]),_:2},1032,["icon","disabled","onClick"])):P("v-if",!0),c(n).batchAdd?(_(),y(u,{key:2,type:"primary",icon:c(ae),plain:"",onClick:f},{default:o(()=>[Fe]),_:1},8,["icon"])):P("v-if",!0),c(n).export?(_(),y(u,{key:3,type:"primary",icon:c(oe),plain:"",onClick:s},{default:o(()=>[ze]),_:1},8,["icon"])):P("v-if",!0)]),expand:o(l=>[b(z(l.row),1)]),action:o(l=>[a(u,{type:"primary",link:"",icon:c(F),onClick:v=>h("Edit",l.row)},{default:o(()=>[Je]),_:2},1032,["icon","onClick"])]),_:1},8,["requestApi","initParam"])])]),_:1})]),_:1}),a(Ie,{ref_key:"drawerRefProject",ref:S},null,512),a($e,{ref_key:"drawerRefComponent",ref:E},null,512),a(re,{ref_key:"dialogRef",ref:r},null,512)])}}}),tt=J(Le,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/projects/projects.vue"]]);export{tt as default};