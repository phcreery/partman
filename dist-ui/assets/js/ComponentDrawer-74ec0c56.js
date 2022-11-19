import{d as z,a as X,r as m,U as Z,b as n,a3 as se,c as w,v as F,w as t,f as e,V as L,W as ie,j as D,_ as ee,l as U,E as A,e as j,g as C,h as S,P as ue,I as H,Y as K,a4 as Q,F as oe,N as re,D as ge,a5 as be}from"./index-39a2cc13.js";import{g as ce,i as he,j as De,k as ne,l as ye,d as Ve}from"./components-5491d717.js";import{n as Ce}from"./util-bb5d7d1d.js";import{F as ke}from"./FootprintDrawer-364304d8.js";import{S as Pe}from"./StorageDrawer-2080d9a2.js";import{c as te}from"./index-9c5b8b05.js";const Se=U("Cancel"),Ue=U("Save"),Ne=z({name:"UserDrawer"}),$e=z({...Ne,setup(y,{expose:u}){const N=i=>{c.value=i,l.value=!0},_=X({name:[{required:!0,message:"Please upload the component name",trigger:"change"}],description:[{required:!1,message:"Please fill in the description",trigger:"change"}],parent:[{required:!0,message:"Please select parent",trigger:"change"}]}),p={value:"id",label:"name",emitPath:!1},l=m(!1),c=m({isView:!1,title:""}),q=m(),$=()=>{q.value.validate(async i=>{if(q.value,k.value,c.value.rowData,!!i)try{await c.value.apiUrl(c.value.rowData),A.success({message:`${c.value.title} component success!`}),c.value.updateTable(),l.value=!1}catch(s){}})},k=m();return Z(l,i=>{i&&ce().then(s=>{s&&(k.value=s.data)})}),u({acceptParams:N}),(i,s)=>{const g=n("el-input"),b=n("el-form-item"),T=n("el-tree-select"),M=n("el-form"),P=n("el-button"),x=n("el-drawer"),R=se("loading");return w(),F(x,{modelValue:l.value,"onUpdate:modelValue":s[4]||(s[4]=d=>l.value=d),"destroy-on-close":!0,size:"600px",title:`${c.value.title} Component Category`},{footer:t(()=>[e(P,{onClick:s[3]||(s[3]=d=>l.value=!1)},{default:t(()=>[Se]),_:1}),L(e(P,{type:"primary",onClick:$},{default:t(()=>[Ue]),_:1},512),[[ie,!c.value.isView]])]),default:t(()=>[e(M,{ref_key:"ruleFormRef",ref:q,rules:_,disabled:c.value.isView,model:c.value.rowData,"label-width":"130px","label-suffix":" :","append-to-body":!0},{default:t(()=>[e(b,{label:"Name",prop:"name"},{default:t(()=>[e(g,{modelValue:c.value.rowData.name,"onUpdate:modelValue":s[0]||(s[0]=d=>c.value.rowData.name=d),placeholder:"Please fill in the component name",clearable:""},null,8,["modelValue"])]),_:1}),e(b,{label:"Description",prop:"description"},{default:t(()=>[e(g,{modelValue:c.value.rowData.description,"onUpdate:modelValue":s[1]||(s[1]=d=>c.value.rowData.description=d),placeholder:"Please fill in the component description",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1}),L((w(),F(b,{label:"Parent",prop:"parent"},{default:t(()=>[D(` <el-select v-model="drawerData.rowData!.category" placeholder="" clearable>
					<el-option v-for="item in componentCategories" :key="item.id" :label="item.name" :value="item.id" />
				</el-select> `),D(' <el-cascader v-model="drawerData.rowData!.category" :options="componentCategories" :props="cascaderProps" /> '),e(T,{modelValue:c.value.rowData.parent,"onUpdate:modelValue":s[2]||(s[2]=d=>c.value.rowData.parent=d),multiple:!1,data:k.value,props:p,clearable:"","render-after-expand":!1,checkStrictly:!0,"value-key":"id"},null,8,["modelValue","data"])]),_:1})),[[R,k.value===void 0]])]),_:1},8,["rules","disabled","model"])]),_:1},8,["modelValue","title"])}}});var xe=ee($e,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/categories/components/ComponentCategoryDrawer.vue"]]);const Fe=async()=>{let u=(await te.records.getList("config")).items.find(p=>p.category==="octopart");const N=u==null?void 0:u.value.id,_=u==null?void 0:u.value.secret;return{id:N,secret:_}},qe=async()=>{let y=await Fe(),u=await te.send("/api/octopart/connect/token",{method:"POST",body:`grant_type=client_credentials&client_id=${y.id}&client_secret=${y.secret}`,headers:{"Content-Type":"application/x-www-form-urlencoded"}});return"error"in u?(A.error(`Octopart Token Error: ${u.error}`),""):u.access_token},Te=async()=>await qe(),Me=async y=>{let u=await Te();return(await te.send("/api/octopart/graphql",{method:"POST",body:y,headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`}})).data},Re=async y=>{let u=await Me({query:`query Search($mpn: String!) {
              supSearchMpn(q: $mpn, limit: 2) {
                results {
                  part {
                    mpn
                    shortDescription
                    descriptions {
                      text
                      creditString
                      creditUrl
                    }
                    manufacturer {
                      name
                    }
                    category {
                      name
                      path
                    }
                    specs {
                      attribute {
                        name
                      }
                      value
                      units
                    }
                  }
                }
              }
            }`,variables:{mpn:y}});return u.supSearchMpn.results&&u.supSearchMpn.results.length>0&&u.supSearchMpn.results[0].part,u.supSearchMpn},Oe={class:"form-item-with-buttons"},Le=U("Cancel"),ze={style:{margin:"4%"}},Ie=U("Import"),Ee=C("div",null,"Description",-1),Be=C("div",null,"Category",-1),je=C("h3",null,"Attributes",-1),Ae=z({name:"UserDrawer"}),Je=z({...Ae,setup(y,{expose:u}){const N=X({mpn:[{required:!0,message:"Please input the MPN",trigger:"change"}]}),_=m(!1),p=m({isView:!1,title:""}),l=i=>{p.value=i,_.value=!0,$.value=[],k()},c=m(),q=i=>{p.value.rowData,c.value.validate(async s=>{if(!!s)try{let g={mpn:i.mpn,manufacturer:i.manufacturer.name,specs:i.specs,description:i.shortDescription};p.value.updateTable(g),_.value=!1}catch(g){A.error(String(g))}})},$=m([]),k=async()=>{var i;$.value=(await Re(((i=p.value.rowData)==null?void 0:i.mpn)||"")).results};return Z(_,i=>{}),u({acceptParams:l}),(i,s)=>{const g=n("el-input"),b=n("el-button"),T=n("el-space"),M=n("el-form-item"),P=n("el-form"),x=n("el-descriptions-item"),R=n("el-descriptions"),d=n("el-table-column"),E=n("el-table"),B=n("el-drawer");return w(),j("div",null,[e(B,{modelValue:_.value,"onUpdate:modelValue":s[2]||(s[2]=v=>_.value=v),"destroy-on-close":!0,size:"600px",title:`${p.value.title} Octopart Component`},{footer:t(()=>[e(b,{onClick:s[1]||(s[1]=v=>_.value=!1)},{default:t(()=>[Le]),_:1}),D(' <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button> ')]),default:t(()=>[e(P,{ref_key:"ruleFormRef",ref:c,rules:N,disabled:p.value.isView,model:p.value.rowData,"label-width":"80px","label-suffix":" :","append-to-body":!0},{default:t(()=>[e(M,{label:"MPN",prop:"mpn"},{default:t(()=>[C("div",Oe,[e(T,null,{default:t(()=>[e(g,{modelValue:p.value.rowData.mpn,"onUpdate:modelValue":s[0]||(s[0]=v=>p.value.rowData.mpn=v),placeholder:"Please fill in the component name",clearable:""},null,8,["modelValue"]),e(b,{icon:S(ue),onClick:k},null,8,["icon"])]),_:1})])]),_:1})]),_:1},8,["rules","disabled","model"]),e(E,{data:$.value,border:!0,style:{width:"100%"}},{default:t(()=>[e(d,{type:"expand"},{default:t(v=>[C("div",ze,[e(R,{title:"Summary",column:1,border:"",direction:"vertical"},{extra:t(()=>[e(b,{type:"primary",onClick:J=>q(v.row.part)},{default:t(()=>[Ie]),_:2},1032,["onClick"])]),default:t(()=>[e(x,null,{label:t(()=>[Ee]),default:t(()=>[U(" "+H(v.row.part.shortDescription),1)]),_:2},1024),v.row.part.category?(w(),F(x,{key:0},{label:t(()=>[Be]),default:t(()=>[U(" "+H(v.row.part.category.name)+" ("+H(v.row.part.category.path)+") ",1)]),_:2},1024)):D("v-if",!0)]),_:2},1024),je,e(E,{data:v.row.part.specs,border:!0},{default:t(()=>[e(d,{label:"Attribute",prop:"attribute.name"}),e(d,{label:"Value",prop:"value"}),e(d,{label:"Value",prop:"units"})]),_:2},1032,["data"])])]),_:1}),e(d,{label:"MPN",prop:"part.mpn",width:"140"}),e(d,{label:"Description",prop:"part.shortDescription"}),D(` <el-table-column fixed="right" label="" width="80">
					<template #default>
						<el-button link type="primary" size="small">Import</el-button>
					</template>
				</el-table-column> `)]),_:1},8,["data"])]),_:1},8,["modelValue","title"])])}}});var We=ee(Je,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/inventory/components/OctopartComponentDrawer.vue"]]);const Ye={class:"form-item-with-buttons"},Ge={class:"form-item-with-buttons"},He={class:"form-item-with-buttons"},Ke={class:"form-item-with-buttons"},Qe={class:"form-item-with-buttons"},Xe=U("New spec"),Ze=U("Cancel"),et=U("Save"),tt=z({name:"ComponentDrawer"}),at=z({...tt,setup(y,{expose:u}){const N=X({mpn:[{required:!0,message:"Please upload the component name",trigger:"change"}],description:[{required:!1,message:"Please enter component description",trigger:"change"}],manufacturer:[{required:!1,message:"Please enter component manufacturer",trigger:"change"}],footprint:[{required:!1,message:"Please fill in the footprint",trigger:"change"}],stock:[{required:!0,message:"Please fill in the stock qty",trigger:"change"}],storage_location:[{required:!1,message:"Please select location",trigger:"change"}],category:[{required:!1,message:"Please select category",trigger:"change"}],ipn:[{required:!1,message:"Please fill in IPN",trigger:"change"}]}),_={value:"id",label:"name",disabled:"disabled",emitPath:!1},p=m(!1),l=m({isView:!1,title:""}),c=o=>{l.value=o,p.value=!0},q=o=>{Ce(l.value.rowData,o)},$=m(),k=()=>{$.value.validate(async o=>{if(!!o)try{await l.value.apiUrl(l.value.rowData),A.success({message:`${l.value.title} component success!`}),l.value.updateTable(),p.value=!1}catch(a){}})},i=(o,a)=>a.name.toLowerCase().includes(o.toLowerCase()),s=()=>{var o,a;l.value.rowData&&typeof((o=l.value.rowData)==null?void 0:o.specs)!="object"&&(l.value.rowData.specs=[]),(a=l.value.rowData)==null||a.specs.push({attribute:{name:"",shortname:"",group:""},value:"",units:""})},g=o=>{var a;(a=l.value.rowData)==null||a.specs.splice(o,1)},b=m(),T=m(),M=m(),P=()=>ce().then(o=>b.value=o.data),x=()=>he().then(o=>{T.value=o.data,o.data}),R=()=>De().then(o=>M.value=o.data);Z(p,o=>{o&&(P(),x(),R())});const d=m(),E=(o,a={})=>{let f={title:o,rowData:{...a},isView:o==="View",apiUrl:o==="New"?ne:"",updateTable:R};d.value.acceptParams(f)},B=m(),v=(o,a={})=>{let f={title:o,rowData:{...a},isView:o==="View",apiUrl:o==="New"?ye:"",updateTable:x};B.value.acceptParams(f)},J=m(),pe=(o,a={})=>{let f={title:o,rowData:{...a},isView:o==="View",apiUrl:o==="New"?Ve:"",updateTable:P};J.value.acceptParams(f)},ae=m(),de=(o,a={})=>{let f={title:o,rowData:{...a},isView:o==="View",apiUrl:o==="New"?ne:"",updateTable:q};ae.value.acceptParams(f)};return u({acceptParams:c}),(o,a)=>{const f=n("el-input"),h=n("el-button"),I=n("el-space"),V=n("el-form-item"),me=n("el-input-number"),le=n("el-tree-select"),W=n("el-button-group"),fe=n("el-option"),_e=n("el-select"),ve=n("el-form"),we=n("el-drawer"),Y=se("loading");return w(),j("div",null,[e(we,{modelValue:p.value,"onUpdate:modelValue":a[13]||(a[13]=r=>p.value=r),"destroy-on-close":!0,size:"600px",title:`${l.value.title} Component`},{footer:t(()=>[e(h,{onClick:a[12]||(a[12]=r=>p.value=!1)},{default:t(()=>[Ze]),_:1}),L(e(h,{type:"primary",onClick:k},{default:t(()=>[et]),_:1},512),[[ie,!l.value.isView]])]),default:t(()=>[e(ve,{ref_key:"ruleFormRef",ref:$,rules:N,disabled:l.value.isView,model:l.value.rowData,"label-width":"130px","label-suffix":" :","append-to-body":!0},{default:t(()=>[D(` <el-form-item label="profile picture" prop="avatar">
                <UploadImg
                    v-model:imageUrl="drawerData.rowData!.avatar"
                    :disabled="drawerData.isView"
                    :upload-style="{ width: '120px', height: '120px' }"
                    @check-validate="checkValidate('avatar')"
                >
                    <template #tip> The size cannot exceed 3M </template>
                </UploadImg>
            </el-form-item> `),e(V,{label:"MPN",prop:"mpn"},{default:t(()=>[C("div",Ye,[e(I,null,{default:t(()=>[e(f,{modelValue:l.value.rowData.mpn,"onUpdate:modelValue":a[0]||(a[0]=r=>l.value.rowData.mpn=r),placeholder:"Please fill in the component name",clearable:""},null,8,["modelValue"]),e(h,{icon:S(ue),onClick:a[1]||(a[1]=r=>de("New",l.value.rowData))},null,8,["icon"])]),_:1})])]),_:1}),e(V,{label:"Manufacturer",prop:"manufacturer"},{default:t(()=>[e(f,{modelValue:l.value.rowData.manufacturer,"onUpdate:modelValue":a[2]||(a[2]=r=>l.value.rowData.manufacturer=r),placeholder:"Please fill in the component manufacturer",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1}),e(V,{label:"Description",prop:"description"},{default:t(()=>[e(f,{modelValue:l.value.rowData.description,"onUpdate:modelValue":a[3]||(a[3]=r=>l.value.rowData.description=r),placeholder:"Please fill in the component description",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1}),e(V,{label:"IPN",prop:"ipn"},{default:t(()=>[e(f,{modelValue:l.value.rowData.ipn,"onUpdate:modelValue":a[4]||(a[4]=r=>l.value.rowData.ipn=r),placeholder:"Internal Part Number",clearable:""},null,8,["modelValue"])]),_:1}),e(V,{label:"Stock",prop:"stock"},{default:t(()=>[e(me,{modelValue:l.value.rowData.stock,"onUpdate:modelValue":a[5]||(a[5]=r=>l.value.rowData.stock=r)},null,8,["modelValue"])]),_:1}),L((w(),F(V,{label:"Storage Location",prop:"storage_location"},{default:t(()=>[C("div",Ge,[e(I,null,{default:t(()=>[D(` <el-select v-model="drawerData.rowData!.storage_location" placeholder="" clearable filterable>
                <el-option v-for="item in componentStorageLocations" :key="item.id" :label="item.name" :value="item.id" />
              </el-select> `),e(le,{modelValue:l.value.rowData.storage_location,"onUpdate:modelValue":a[6]||(a[6]=r=>l.value.rowData.storage_location=r),multiple:!1,data:T.value,props:_,clearable:"","render-after-expand":!1,checkStrictly:!0,filterable:"","filter-node-method":i},null,8,["modelValue","data"]),e(W,null,{default:t(()=>[e(h,{icon:S(K),onClick:x},null,8,["icon"]),e(h,{icon:S(Q),onClick:a[7]||(a[7]=r=>v("New"))},null,8,["icon"])]),_:1})]),_:1})])]),_:1})),[[Y,T.value===void 0]]),L((w(),F(V,{label:"Category",prop:"category"},{default:t(()=>[C("div",He,[e(I,null,{default:t(()=>[D(` <el-select v-model="drawerData.rowData!.category" placeholder="" clearable>
                    <el-option v-for="item in componentCategories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select> `),D(' <el-cascader v-model="drawerData.rowData!.category" :options="componentCategories" :props="cascaderProps" /> '),e(le,{modelValue:l.value.rowData.category,"onUpdate:modelValue":a[8]||(a[8]=r=>l.value.rowData.category=r),multiple:!1,data:b.value,props:_,clearable:"","render-after-expand":!1,checkStrictly:!0,filterable:"","filter-node-method":i},null,8,["modelValue","data"]),e(W,null,{default:t(()=>[e(h,{icon:S(K),onClick:P},null,8,["icon"]),e(h,{icon:S(Q),onClick:a[9]||(a[9]=r=>pe("New"))},null,8,["icon"])]),_:1})]),_:1})])]),_:1})),[[Y,b.value===void 0]]),L((w(),F(V,{label:"Footprint",prop:"footprint"},{default:t(()=>[C("div",Ke,[e(I,null,{default:t(()=>[e(_e,{modelValue:l.value.rowData.footprint,"onUpdate:modelValue":a[10]||(a[10]=r=>l.value.rowData.footprint=r),placeholder:"",clearable:"",filterable:"",style:{width:"max-content"}},{default:t(()=>[(w(!0),j(oe,null,re(M.value,r=>(w(),F(fe,{key:r.id,label:r.name,value:r.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),e(W,null,{default:t(()=>[e(h,{icon:S(K),onClick:P},null,8,["icon"]),e(h,{icon:S(Q),onClick:a[11]||(a[11]=r=>E("New"))},null,8,["icon"])]),_:1})]),_:1})])]),_:1})),[[Y,M.value===void 0]]),D(" Specs {{ drawerData.rowData!.specs }} "),(w(!0),j(oe,null,re(l.value.rowData.specs,(r,G)=>(w(),F(V,{key:G,label:"Spec",prop:G+".value"},{default:t(()=>[e(f,{style:{"margin-bottom":"6px"},modelValue:r.attribute.name,"onUpdate:modelValue":O=>r.attribute.name=O,placeholder:"Attribute"},null,8,["modelValue","onUpdate:modelValue"]),C("div",Qe,[e(I,null,{default:t(()=>[e(f,{modelValue:r.value,"onUpdate:modelValue":O=>r.value=O,placeholder:"Value"},null,8,["modelValue","onUpdate:modelValue"]),e(f,{modelValue:r.units,"onUpdate:modelValue":O=>r.units=O,placeholder:"Units"},null,8,["modelValue","onUpdate:modelValue"]),D(` <el-button-group>
                                <el-button :icon="Refresh" @click="refreshCategories" />
                                <el-button :icon="Plus" @click="openFootprintDrawer('New')" />
                            </el-button-group> `),e(h,{type:"danger",icon:S(ge),onClick:be(O=>g(G),["prevent"])},null,8,["icon","onClick"])]),_:2},1024)])]),_:2},1032,["prop"]))),128)),e(V,null,{default:t(()=>[e(h,{onClick:s},{default:t(()=>[Xe]),_:1})]),_:1})]),_:1},8,["rules","disabled","model"])]),_:1},8,["modelValue","title"]),e(ke,{ref_key:"drawerRefNestedFootprint",ref:d},null,512),e(Pe,{ref_key:"drawerRefNestedStorage",ref:B},null,512),e(xe,{ref_key:"drawerRefNestedComponentCategory",ref:J},null,512),e(We,{ref_key:"drawerRefNestedOctopartComponent",ref:ae},null,512)])}}});var ut=ee(at,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/inventory/components/ComponentDrawer.vue"]]);export{ut as C,xe as a};
