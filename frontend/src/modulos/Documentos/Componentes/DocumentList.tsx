import { useState } from "react";
import { PdfModal } from "./PdfModal";

type Documento = {
  id:number;
  titulo:string;
  tipo:string;
  estado:string;
  fecha:string;
  organismo:string;
  descripcion:string;
  archivo:string;
};

type DocumentListProps = {
  documentos:Documento[];
};

export const DocumentList=({
  documentos
}:DocumentListProps)=>{

const [pdfSeleccionado,setPdfSeleccionado]=useState<string|null>(null);

return(
<>

<div className="w-full">

<p className="mb-3 text-sm text-slate-400">
{documentos.length} documentos encontrados
</p>


<div className="space-y-3 pb-6">


{documentos.map((doc)=>(


<article
key={doc.id}
className="
rounded-xl
border
border-slate-200
bg-white
p-3
shadow-sm
md:p-6
"
>


<div
className="
flex
flex-col
gap-2
md:flex-row
md:items-start
"
>


<h3
className="
min-w-0
flex-1
wrap-break-word
text-base
font-semibold
text-slate-900
md:text-lg
"
>
{doc.titulo}
</h3>


<span
className="
w-fit
rounded-full
bg-green-100
px-3
py-1
text-xs
text-green-700
"
>
{doc.estado}
</span>


</div>


<div
className="
mt-2
flex
flex-wrap
gap-2
text-xs
text-slate-400
md:text-sm
"
>

<span>{doc.tipo}</span>
<span>{doc.fecha}</span>
<span>{doc.organismo}</span>

</div>



<p
className="
mt-2
wrap-break-word
text-sm
text-slate-600
"
>
{doc.descripcion}
</p>



<button
onClick={()=>setPdfSeleccionado(doc.archivo)}
className="
mt-3
w-full
rounded-lg
bg-sidebar
py-2
text-sm
text-white
md:w-auto
md:px-4
"
>
Ver documento
</button>



</article>


))}


</div>

</div>



{pdfSeleccionado&&(
<PdfModal
archivo={pdfSeleccionado}
onClose={()=>setPdfSeleccionado(null)}
/>
)}


</>

)

}