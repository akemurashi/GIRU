import robotLogo from "/assets/Imagenes/giru.jpg";

export const SidebarHeaderMenu = () => {
  return (
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-center gap-3">
        <img
          src={robotLogo}
          alt="GIRU Robot"
          className="w-16 h-16 object-contain"
        />

        <h1 className="text-3xl font-black font-serif">
          GIRU
        </h1>
      </div>
    </div>
  );
};