import robotLogo from "/assets/Imagenes/giru.jpg";

export const SidebarHeaderMenu = () => {
  return (
    <div className="p-4 md:p-6 border-b border-white/10">
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <img
          src={robotLogo}
          alt="GIRU Robot"
          className="w-11 h-11 md:w-16 md:h-16 object-contain"
        />

        <h1 className="text-xl md:text-3xl font-black font-serif">
          GIRU
        </h1>
      </div>
    </div>
  );
};