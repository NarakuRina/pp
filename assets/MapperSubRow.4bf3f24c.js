import{s as o,a as n,c,f as b,r as x,b as a,F as v,j as e,E as C,o as M}from"./index.84df026b.js";import{l as T,t as m}from"./index.95666276.js";import{P as w,F as $,S as W}from"./usePersistQuery.39d4abdc.js";import{T as f}from"./Text.4ae84da6.js";const y=o("button",{all:"unset",width:"100%",cursor:"pointer",borderRadius:n.sm,"&:hover":{background:c.sand4},variants:{expanded:{true:{background:c.sand4}}}}),E=o("div",{width:"100%",padding:`${n.xxs} ${n.sm}`,borderRadius:n.sm,display:"flex",flexFlow:"row nowrap",alignItems:"center",justifyContent:"flex-end",gap:n.md}),R=o("td",{fontSize:b[75]}),z=o("td",{padding:n.xs,paddingRight:n.md}),B=o("td",{width:"85%",fontWeight:"bold",fontSize:b[150],padding:n.xxs,paddingRight:n.sm}),F=o("div",{variants:{first:{true:{fontSize:b[125]},false:{fontSize:b[75]}}}}),k=o(w,{flex:"1 1 auto",borderRadius:n.xs,height:"1em",width:"auto"}),P=o("div",{minWidth:"3em",textAlign:"center"}),j=t=>({[1]:"gold",[2]:"silver",[3]:c.bronze.toString()})[t]||"grey",A=({names:t})=>e(v,{children:t.map((r,s)=>e(F,{first:s===0,children:r},s))}),I=x.exports.memo(function({mapper:r,maxValue:s,isExpanded:h,onToggleMapper:u}){return a(v,{children:[a(R,{children:[r.place,"."]}),e(z,{children:e(C,{url:M(r.id),children:e(A,{names:r.names})})}),e(B,{children:e(y,{expanded:h,onClick:()=>u(r.id),children:a(E,{children:[e(P,{children:Math.round(r.value)}),e(k,{progress:r.value/s,color:j(r.place)}),e($,{flipped:h})]})})})]})}),N=o("table",{borderCollapse:"collapse",width:n.tableMaxWidth,maxWidth:"100%",margin:"0 auto"}),U=o("tr",{width:"100%",borderBottom:`${n.borderWidth} solid ${c.border}`}),J=({mappers:t,maxValue:r,loadMore:s,renderExpandedRow:h,scrollParent:u})=>{const[g,i]=x.exports.useState({}),p=x.exports.useCallback(l=>{i(d=>({...d,[l]:!d[l]}))},[]),S=x.exports.useMemo(()=>t==null?void 0:t.reduce((l,d)=>(l.push(d),g[d.id]&&l.push({...d,isExpandRow:!0}),l),[]),[t,g]);return e(T,{style:{width:"100%"},data:S,endReached:s,overscan:1e3,components:{TableRow:U,Table:N},itemContent:(l,d)=>d.isExpandRow?e("td",{colSpan:3,children:h({mapper:d,index:l})}):e(I,{isExpanded:g[d.id],onToggleMapper:p,mapper:d,maxValue:r}),customScrollParent:u})},L=o("div",{fontSize:"1rem",fontWeight:"normal",padding:`0 ${n.xl}`,boxShadow:`inset 0 -1em 0.75em -1em ${c.sand1}, inset 0 1em 0.75em -1em ${c.sand1}`,"& td":{width:"50%",padding:n.xs},"& tr":{borderBottom:`${n.borderWidth} solid ${c.border}`},"& table":{borderCollapse:"collapse",width:"100%"}}),V=o(w,{width:"100%",borderRadius:n.xxs,height:"1.3em",lineHeight:1.4}),K=({data:t,children:r,customHeaderRow:s,getUrl:h})=>{const u=t?t.reduce((i,p)=>i+p.value,0)/t.length:0,g=t?t[0].value:0;return a(L,{children:[r,t&&e(W,{css:{maxHeight:"20em",height:"auto"},children:a("table",{children:[e("thead",{children:s!=null?s:a("tr",{children:[e("td",{}),a("td",{children:[e(f,{bold:!0,children:t.length})," maps; average points per map:"," ",e(f,{bold:!0,children:m(u)})]})]})}),e("tbody",{children:t.map(i=>a("tr",{children:[e("td",{children:e(C,{url:h(i.id),children:i.text})}),e("td",{children:e(V,{progress:i.value/g,children:e("div",{style:{position:"absolute",top:0,left:"0.4em"},children:m(i.value,10)})})})]},i.id))})]})})]})};export{K as M,J as a};
