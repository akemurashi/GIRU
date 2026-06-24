import { FilterHeader } from "./FilterHeader";
import { FilterForm } from "./FilterForm";

type FilterSidebarProps={
tipoSeleccionado:string;
onTipoChange:(tipo:string)=>void;
};

export const FilterSidebar=({
tipoSeleccionado,
onTipoChange,
}:FilterSidebarProps)=>{

return(
<aside
className="
w-full
lg:w-72
bg-white
border
border-slate-200
lg:border-y-0
lg:border-l-0
p-3
md:p-6
"
>

<FilterHeader/>

<FilterForm
tipoSeleccionado={tipoSeleccionado}
onTipoChange={onTipoChange}
/>

</aside>
);
};