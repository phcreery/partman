import{d as I,a as ee,r as m,U as te,b as n,a4 as ie,c as _,v as U,w as t,f as e,V as z,W as ue,j as V,_ as ae,l as N,E as A,e as E,g as C,h as S,P as ce,I as H,F as K,N as Q,Y as X,a5 as Z,D as ge,a6 as be}from"./index-411664c1.js";import{g as pe,i as he,j as De,k as se,l as ye,d as Ve}from"./components-bdf98b0c.js";import{n as Ce}from"./util-006b265b.js";import{F as ke}from"./FootprintDrawer-bb92f8f3.js";import{S as Pe}from"./StorageDrawer-60d89e19.js";import{c as le}from"./index-6bf0d9f6.js";const Se=N("Cancel"),Ue=N("Save"),Ne=I({name:"UserDrawer"}),$e=I({...Ne,setup(D,{expose:i}){const $=u=>{c.value=u,l.value=!0},w=ee({name:[{required:!0,message:"Please upload the component name",trigger:"change"}],description:[{required:!1,message:"Please fill in the description",trigger:"change"}],parent:[{required:!0,message:"Please select parent",trigger:"change"}]}),p={value:"id",label:"name",emitPath:!1},l=m(!1),c=m({isView:!1,title:""}),q=m(),x=()=>{q.value.validate(async u=>{if(q.value,k.value,c.value.rowData,!!u)try{await c.value.apiUrl(c.value.rowData),A.success({message:`${c.value.title} component success!`}),c.value.updateTable(),l.value=!1}catch(s){}})},k=m();return te(l,u=>{u&&pe().then(s=>{s&&(k.value=s.data)})}),i({acceptParams:$}),(u,s)=>{const g=n("el-input"),b=n("el-form-item"),T=n("el-tree-select"),M=n("el-form"),P=n("el-button"),F=n("el-drawer"),R=ie("loading");return _(),U(F,{modelValue:l.value,"onUpdate:modelValue":s[4]||(s[4]=d=>l.value=d),"destroy-on-close":!0,size:"600px",title:`${c.value.title} Component Category`},{footer:t(()=>[e(P,{onClick:s[3]||(s[3]=d=>l.value=!1)},{default:t(()=>[Se]),_:1}),z(e(P,{type:"primary",onClick:x},{default:t(()=>[Ue]),_:1},512),[[ue,!c.value.isView]])]),default:t(()=>[e(M,{ref_key:"ruleFormRef",ref:q,rules:w,disabled:c.value.isView,model:c.value.rowData,"label-width":"130px","label-suffix":" :","append-to-body":!0},{default:t(()=>[e(b,{label:"Name",prop:"name"},{default:t(()=>[e(g,{modelValue:c.value.rowData.name,"onUpdate:modelValue":s[0]||(s[0]=d=>c.value.rowData.name=d),placeholder:"Please fill in the component name",clearable:""},null,8,["modelValue"])]),_:1}),e(b,{label:"Description",prop:"description"},{default:t(()=>[e(g,{modelValue:c.value.rowData.description,"onUpdate:modelValue":s[1]||(s[1]=d=>c.value.rowData.description=d),placeholder:"Please fill in the component description",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1}),z((_(),U(b,{label:"Parent",prop:"parent"},{default:t(()=>[V(` <el-select v-model="drawerData.rowData!.category" placeholder="" clearable>
					<el-option v-for="item in componentCategories" :key="item.id" :label="item.name" :value="item.id" />
				</el-select> `),V(' <el-cascader v-model="drawerData.rowData!.category" :options="componentCategories" :props="cascaderProps" /> '),e(T,{modelValue:c.value.rowData.parent,"onUpdate:modelValue":s[2]||(s[2]=d=>c.value.rowData.parent=d),multiple:!1,data:k.value,props:p,clearable:"","render-after-expand":!1,checkStrictly:!0,"value-key":"id"},null,8,["modelValue","data"])]),_:1})),[[R,k.value===void 0]])]),_:1},8,["rules","disabled","model"])]),_:1},8,["modelValue","title"])}}});var xe=ae($e,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/categories/components/ComponentCategoryDrawer.vue"]]);const Fe=async()=>{let i=(await le.records.getList("config")).items.find(p=>p.category==="octopart");const $=i==null?void 0:i.value.id,w=i==null?void 0:i.value.secret;return{id:$,secret:w}},qe=async()=>{let D=await Fe(),i=await le.send("/api/octopart/connect/token",{method:"POST",body:`grant_type=client_credentials&client_id=${D.id}&client_secret=${D.secret}`,headers:{"Content-Type":"application/x-www-form-urlencoded"}});return"error"in i?(A.error(`Octopart Token Error: ${i.error}`),""):i.access_token},Te=async()=>await qe(),Me=async D=>{let i=await Te();return(await le.send("/api/octopart/graphql",{method:"POST",body:D,headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`}})).data},Re=async D=>{let i=await Me({query:`query Search($mpn: String!) {
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
            }`,variables:{mpn:D}});return i.supSearchMpn.results&&i.supSearchMpn.results.length>0&&i.supSearchMpn.results[0].part,i.supSearchMpn},Oe={class:"form-item-with-buttons"},ze=N("Cancel"),Ie={style:{margin:"4%"}},Le=N("Import"),Ee=C("div",null,"Description",-1),Be=C("div",null,"Category",-1),je=C("h3",null,"Attributes",-1),Ae=I({name:"UserDrawer"}),Je=I({...Ae,setup(D,{expose:i}){const $=ee({mpn:[{required:!0,message:"Please input the MPN",trigger:"change"}]}),w=m(!1),p=m({isView:!1,title:""}),l=u=>{p.value=u,w.value=!0,x.value=[],k()},c=m(),q=u=>{p.value.rowData,c.value.validate(async s=>{if(!!s)try{let g={mpn:u.mpn,manufacturer:u.manufacturer.name,specs:u.specs,description:u.shortDescription};p.value.updateTable(g),w.value=!1}catch(g){A.error(String(g))}})},x=m([]),k=async()=>{var u;x.value=(await Re(((u=p.value.rowData)==null?void 0:u.mpn)||"")).results};return te(w,u=>{}),i({acceptParams:l}),(u,s)=>{const g=n("el-input"),b=n("el-button"),T=n("el-space"),M=n("el-form-item"),P=n("el-form"),F=n("el-descriptions-item"),R=n("el-descriptions"),d=n("el-table-column"),B=n("el-table"),j=n("el-drawer");return _(),E("div",null,[e(j,{modelValue:w.value,"onUpdate:modelValue":s[2]||(s[2]=v=>w.value=v),"destroy-on-close":!0,size:"600px",title:`${p.value.title} Octopart Component`},{footer:t(()=>[e(b,{onClick:s[1]||(s[1]=v=>w.value=!1)},{default:t(()=>[ze]),_:1}),V(' <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button> ')]),default:t(()=>[e(P,{ref_key:"ruleFormRef",ref:c,rules:$,disabled:p.value.isView,model:p.value.rowData,"label-width":"80px","label-suffix":" :","append-to-body":!0},{default:t(()=>[e(M,{label:"MPN",prop:"mpn"},{default:t(()=>[C("div",Oe,[e(T,null,{default:t(()=>[e(g,{modelValue:p.value.rowData.mpn,"onUpdate:modelValue":s[0]||(s[0]=v=>p.value.rowData.mpn=v),placeholder:"Please fill in the component name",clearable:""},null,8,["modelValue"]),e(b,{icon:S(ce),onClick:k},null,8,["icon"])]),_:1})])]),_:1})]),_:1},8,["rules","disabled","model"]),e(B,{data:x.value,border:!0,style:{width:"100%"}},{default:t(()=>[e(d,{type:"expand"},{default:t(v=>[C("div",Ie,[e(R,{title:"Summary",column:1,border:"",direction:"vertical"},{extra:t(()=>[e(b,{type:"primary",onClick:J=>q(v.row.part)},{default:t(()=>[Le]),_:2},1032,["onClick"])]),default:t(()=>[e(F,null,{label:t(()=>[Ee]),default:t(()=>[N(" "+H(v.row.part.shortDescription),1)]),_:2},1024),v.row.part.category?(_(),U(F,{key:0},{label:t(()=>[Be]),default:t(()=>[N(" "+H(v.row.part.category.name)+" ("+H(v.row.part.category.path)+") ",1)]),_:2},1024)):V("v-if",!0)]),_:2},1024),je,e(B,{data:v.row.part.specs,border:!0},{default:t(()=>[e(d,{label:"Attribute",prop:"attribute.name"}),e(d,{label:"Value",prop:"value"}),e(d,{label:"Value",prop:"units"})]),_:2},1032,["data"])])]),_:1}),e(d,{label:"MPN",prop:"part.mpn",width:"140"}),e(d,{label:"Description",prop:"part.shortDescription"}),V(` <el-table-column fixed="right" label="" width="80">
					<template #default>
						<el-button link type="primary" size="small">Import</el-button>
					</template>
				</el-table-column> `)]),_:1},8,["data"])]),_:1},8,["modelValue","title"])])}}});var We=ae(Je,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/inventory/components/OctopartComponentDrawer.vue"]]);const Ye={class:"form-item-with-buttons"},Ge={class:"form-item-with-buttons"},He={class:"form-item-with-buttons"},Ke={class:"form-item-with-buttons"},Qe={class:"form-item-with-buttons"},Xe=N("New spec"),Ze=N("Cancel"),et=N("Save"),tt=I({name:"ComponentDrawer"}),at=I({...tt,setup(D,{expose:i}){const $=ee({mpn:[{required:!0,message:"Please upload the component name",trigger:"change"}],description:[{required:!1,message:"Please enter component description",trigger:"change"}],manufacturer:[{required:!1,message:"Please enter component manufacturer",trigger:"change"}],footprint:[{required:!1,message:"Please fill in the footprint",trigger:"change"}],stock:[{required:!0,message:"Please fill in the stock qty",trigger:"change"}],storage_location:[{required:!1,message:"Please select location",trigger:"change"}],category:[{required:!1,message:"Please select category",trigger:"change"}],ipn:[{required:!1,message:"Please fill in IPN",trigger:"change"}]}),w={value:"id",label:"name",emitPath:!1},p=m(!1),l=m({isView:!1,title:""}),c=o=>{l.value=o,p.value=!0},q=o=>{Ce(l.value.rowData,o)},x=m(),k=()=>{x.value.validate(async o=>{if(!!o)try{await l.value.apiUrl(l.value.rowData),A.success({message:`${l.value.title} component success!`}),l.value.updateTable(),p.value=!1}catch(a){}})},u=(o,a)=>a.name.toLowerCase().includes(o.toLowerCase()),s=()=>{var o,a;l.value.rowData&&typeof((o=l.value.rowData)==null?void 0:o.specs)!="object"&&(l.value.rowData.specs=[]),(a=l.value.rowData)==null||a.specs.push({attribute:{name:"",shortname:"",group:""},value:"",units:""})},g=o=>{var a;(a=l.value.rowData)==null||a.specs.splice(o,1)},b=m(),T=m(),M=m(),P=()=>pe().then(o=>b.value=o.data),F=()=>he().then(o=>T.value=o.data),R=()=>De().then(o=>M.value=o.data);te(p,o=>{o&&(P(),F(),R())});const d=m(),B=(o,a={})=>{let f={title:o,rowData:{...a},isView:o==="View",apiUrl:o==="New"?se:"",updateTable:R};d.value.acceptParams(f)},j=m(),v=(o,a={})=>{let f={title:o,rowData:{...a},isView:o==="View",apiUrl:o==="New"?ye:"",updateTable:F};j.value.acceptParams(f)},J=m(),de=(o,a={})=>{let f={title:o,rowData:{...a},isView:o==="View",apiUrl:o==="New"?Ve:"",updateTable:P};J.value.acceptParams(f)},oe=m(),me=(o,a={})=>{let f={title:o,rowData:{...a},isView:o==="View",apiUrl:o==="New"?se:"",updateTable:q};oe.value.acceptParams(f)};return i({acceptParams:c}),(o,a)=>{const f=n("el-input"),h=n("el-button"),L=n("el-space"),y=n("el-form-item"),fe=n("el-input-number"),re=n("el-option"),ne=n("el-select"),W=n("el-button-group"),_e=n("el-tree-select"),ve=n("el-form"),we=n("el-drawer"),Y=ie("loading");return _(),E("div",null,[e(we,{modelValue:p.value,"onUpdate:modelValue":a[13]||(a[13]=r=>p.value=r),"destroy-on-close":!0,size:"600px",title:`${l.value.title} Component`},{footer:t(()=>[e(h,{onClick:a[12]||(a[12]=r=>p.value=!1)},{default:t(()=>[Ze]),_:1}),z(e(h,{type:"primary",onClick:k},{default:t(()=>[et]),_:1},512),[[ue,!l.value.isView]])]),default:t(()=>[e(ve,{ref_key:"ruleFormRef",ref:x,rules:$,disabled:l.value.isView,model:l.value.rowData,"label-width":"130px","label-suffix":" :","append-to-body":!0},{default:t(()=>[V(` <el-form-item label="profile picture" prop="avatar">
                <UploadImg
                    v-model:imageUrl="drawerData.rowData!.avatar"
                    :disabled="drawerData.isView"
                    :upload-style="{ width: '120px', height: '120px' }"
                    @check-validate="checkValidate('avatar')"
                >
                    <template #tip> The size cannot exceed 3M </template>
                </UploadImg>
            </el-form-item> `),e(y,{label:"MPN",prop:"mpn"},{default:t(()=>[C("div",Ye,[e(L,null,{default:t(()=>[e(f,{modelValue:l.value.rowData.mpn,"onUpdate:modelValue":a[0]||(a[0]=r=>l.value.rowData.mpn=r),placeholder:"Please fill in the component name",clearable:""},null,8,["modelValue"]),e(h,{icon:S(ce),onClick:a[1]||(a[1]=r=>me("New",l.value.rowData))},null,8,["icon"])]),_:1})])]),_:1}),e(y,{label:"Manufacturer",prop:"manufacturer"},{default:t(()=>[e(f,{modelValue:l.value.rowData.manufacturer,"onUpdate:modelValue":a[2]||(a[2]=r=>l.value.rowData.manufacturer=r),placeholder:"Please fill in the component manufacturer",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1}),e(y,{label:"Description",prop:"description"},{default:t(()=>[e(f,{modelValue:l.value.rowData.description,"onUpdate:modelValue":a[3]||(a[3]=r=>l.value.rowData.description=r),placeholder:"Please fill in the component description",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1}),e(y,{label:"Stock",prop:"stock"},{default:t(()=>[e(fe,{modelValue:l.value.rowData.stock,"onUpdate:modelValue":a[4]||(a[4]=r=>l.value.rowData.stock=r)},null,8,["modelValue"])]),_:1}),z((_(),U(y,{label:"Footprint",prop:"footprint"},{default:t(()=>[C("div",Ge,[e(L,null,{default:t(()=>[e(ne,{modelValue:l.value.rowData.footprint,"onUpdate:modelValue":a[5]||(a[5]=r=>l.value.rowData.footprint=r),placeholder:"",clearable:"",filterable:"",style:{width:"max-content"}},{default:t(()=>[(_(!0),E(K,null,Q(M.value,r=>(_(),U(re,{key:r.id,label:r.name,value:r.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),e(W,null,{default:t(()=>[e(h,{icon:S(X),onClick:P},null,8,["icon"]),e(h,{icon:S(Z),onClick:a[6]||(a[6]=r=>B("New"))},null,8,["icon"])]),_:1})]),_:1})])]),_:1})),[[Y,M.value===void 0]]),z((_(),U(y,{label:"Category",prop:"category"},{default:t(()=>[C("div",He,[e(L,null,{default:t(()=>[V(` <el-select v-model="drawerData.rowData!.category" placeholder="" clearable>
                    <el-option v-for="item in componentCategories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select> `),V(' <el-cascader v-model="drawerData.rowData!.category" :options="componentCategories" :props="cascaderProps" /> '),e(_e,{modelValue:l.value.rowData.category,"onUpdate:modelValue":a[7]||(a[7]=r=>l.value.rowData.category=r),multiple:!1,data:b.value,props:w,clearable:"","render-after-expand":!1,checkStrictly:!0,filterable:"","filter-node-method":u},null,8,["modelValue","data"]),e(W,null,{default:t(()=>[e(h,{icon:S(X),onClick:P},null,8,["icon"]),e(h,{icon:S(Z),onClick:a[8]||(a[8]=r=>de("New"))},null,8,["icon"])]),_:1})]),_:1})])]),_:1})),[[Y,b.value===void 0]]),z((_(),U(y,{label:"Storage Location",prop:"storage_location"},{default:t(()=>[C("div",Ke,[e(L,null,{default:t(()=>[e(ne,{modelValue:l.value.rowData.storage_location,"onUpdate:modelValue":a[9]||(a[9]=r=>l.value.rowData.storage_location=r),placeholder:"",clearable:"",filterable:""},{default:t(()=>[(_(!0),E(K,null,Q(T.value,r=>(_(),U(re,{key:r.id,label:r.name,value:r.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),e(W,null,{default:t(()=>[e(h,{icon:S(X),onClick:F},null,8,["icon"]),e(h,{icon:S(Z),onClick:a[10]||(a[10]=r=>v("New"))},null,8,["icon"])]),_:1})]),_:1})])]),_:1})),[[Y,T.value===void 0]]),e(y,{label:"IPN",prop:"ipn"},{default:t(()=>[e(f,{modelValue:l.value.rowData.ipn,"onUpdate:modelValue":a[11]||(a[11]=r=>l.value.rowData.ipn=r),placeholder:"Internal Part Number",clearable:""},null,8,["modelValue"])]),_:1}),V(" Specs {{ drawerData.rowData!.specs }} "),(_(!0),E(K,null,Q(l.value.rowData.specs,(r,G)=>(_(),U(y,{key:G,label:"Spec",prop:G+".value"},{default:t(()=>[e(f,{style:{"margin-bottom":"6px"},modelValue:r.attribute.name,"onUpdate:modelValue":O=>r.attribute.name=O,placeholder:"Attribute"},null,8,["modelValue","onUpdate:modelValue"]),C("div",Qe,[e(L,null,{default:t(()=>[e(f,{modelValue:r.value,"onUpdate:modelValue":O=>r.value=O,placeholder:"Value"},null,8,["modelValue","onUpdate:modelValue"]),e(f,{modelValue:r.units,"onUpdate:modelValue":O=>r.units=O,placeholder:"Units"},null,8,["modelValue","onUpdate:modelValue"]),V(` <el-button-group>
                                <el-button :icon="Refresh" @click="refreshCategories" />
                                <el-button :icon="Plus" @click="openFootprintDrawer('New')" />
                            </el-button-group> `),e(h,{type:"danger",icon:S(ge),onClick:be(O=>g(G),["prevent"])},null,8,["icon","onClick"])]),_:2},1024)])]),_:2},1032,["prop"]))),128)),e(y,null,{default:t(()=>[e(h,{onClick:s},{default:t(()=>[Xe]),_:1})]),_:1})]),_:1},8,["rules","disabled","model"])]),_:1},8,["modelValue","title"]),e(ke,{ref_key:"drawerRefNestedFootprint",ref:d},null,512),e(Pe,{ref_key:"drawerRefNestedStorage",ref:j},null,512),e(xe,{ref_key:"drawerRefNestedComponentCategory",ref:J},null,512),e(We,{ref_key:"drawerRefNestedOctopartComponent",ref:oe},null,512)])}}});var ut=ae(at,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/inventory/components/ComponentDrawer.vue"]]);export{ut as C,xe as a};