import{u as M,k as w,A as z,s as d,a as u,r as l,j as e,t as P,b as f,F as S,C as b}from"./index.84df026b.js";import{u as j,E as v,L as y,S as E}from"./usePersistQuery.39d4abdc.js";import{T as F}from"./Text.4ae84da6.js";import{M as R,a as A}from"./MapperSubRow.4bf3f24c.js";import{f as C}from"./farmValue.881e37b9.js";import"./index.95666276.js";const B=()=>{const a=M();return j(["pp-mappers",a],()=>w({url:`${z}/data/mappers/${a}/pp-mappers.json`}))},I="/assets/prize_bronze.6fca255d.png",L="/assets/prize_gold.1e5272c6.png",T="/assets/prize_silver.dab32962.png",V=d("main",{flex:"1 1 auto",display:"flex",flexFlow:"column nowrap"}),_=d("div",{display:"flex",flexFlow:"row nowrap",alignItems:"center"}),k=d("img",{marginLeft:u.md,height:"1.8em"}),$=(a,r)=>f(_,{children:[e("span",{children:a}),r<3&&e(k,{src:[L,T,I][r],alt:" "})]}),m=a=>C[b.ByPopulationAndTime]({farmValue:a,hoursSinceRanked:1,passCount:1,adjusted:1});function Q(){const{data:a,isLoading:r,error:c}=B(),[n,g]=l.exports.useState(null),t=a==null?void 0:a.top20adj,o=l.exports.useMemo(()=>t==null?void 0:t.map((s,i)=>({id:s.id,names:[$(s.name,i)],value:m(s.points),place:i+1,maps:s.mapsRecorded.map(p=>({value:m(p.ow),id:p.id,text:p.text}))})),[t]),x=o?o[0].value:0,h=l.exports.useCallback(({mapper:s})=>e(R,{data:s.maps,customHeaderRow:e("tr",{children:e("td",{children:e(F,{faded:!0,children:"only showing top 20 maps"})})}),getUrl:P}),[]);return f(V,{children:[c instanceof Error&&e(v,{children:c.message}),r&&e(y,{css:{padding:`${u.md} 0`}}),o&&e(S,{children:e(E,{css:{flex:"1 1 0px"},ref:g,children:e(A,{mappers:o,scrollParent:n!=null?n:void 0,maxValue:x,renderExpandedRow:h})})})]})}export{Q as default};
