import { useLocation } from "react-router-dom";


export type SidebarNavItemProps = {
  href: string;
  icon: string;
  label: string;
};


export const SidebarNavItems = ({
  href,
  icon,
  label,
}: SidebarNavItemProps) => {


  const location = useLocation();


  const isActive = location.pathname === href;


  return (
    <li className="mb-1">


      <a
        href={href}
        className={`
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          transition-all

          ${
            isActive
              ? "bg-white/20 text-white"
              : "text-white/70 hover:bg-white/10"
          }

        `}
      >


        <i className={`pi ${icon} text-lg`} />


        <span className="text-sm">
          {label}
        </span>


      </a>


    </li>
  );
};