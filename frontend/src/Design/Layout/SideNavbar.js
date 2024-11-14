import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SideNavBar = ({ activeItem }) => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false); // State to handle mobile sidebar visibility

  const Menus = [
    { title: "Dashboard", src: "/DashboardNavbarIcon.svg", href: "/dashboard" },
    {
      title: "My Personas",
      src: "/MyPersonaNavbarIcon.svg",
      href: "/personas",
    },
    {
      title: "Accounts",
      src: "https://img.icons8.com/ios-filled/50/000000/user.png",
      gap: true,
      href: "/dashboard",
    },
    {
      title: "Schedule",
      src: "https://img.icons8.com/ios-filled/50/000000/calendar.png",
      href: "/dashboard",
    },
    {
      title: "Search",
      src: "https://img.icons8.com/ios-filled/50/000000/search.png",
      href: "/dashboard",
    },
    {
      title: "Analytics",
      src: "https://img.icons8.com/ios-filled/50/000000/line-chart.png",
      href: "/dashboard",
    },
    {
      title: "Integration",
      src: "/intergrationNavbarIcon.svg",
      gap: true,
      href: "/intergration",
    },
    { title: "Setting", src: "/SettingsNavbarIcon.svg", href: "/dashboard" },
  ];

  return (
    <div className="d-flex">
      {mobileOpen && (
        <div
          className="position-fixed w-100 h-100 bg-black opacity-50"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      <div className="d-md-none position-absolute top-0 start-0 mt-4 ms-4 z-50">
        <img
          src="/HamburgerIcon.svg"
          className="w-8 h-8 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        />
      </div>
      <div
        className={`bg-light h-100 p-4 pt-5 position-relative transition-width ${
          open ? "w-240px" : "w-80px"
        } ${mobileOpen ? "d-block position-fixed" : "d-none"} d-md-block`}
      >
        <img
          src="/ArrowNavBarIcon.svg"
          className={`position-absolute cursor-pointer end-0 top-0 mt-3 border border-light rounded-circle p-1 ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />

        <div className="d-flex align-items-center gap-2 mt-2">
          <img
            src="/SproutEmblum.svg"
            className={`cursor-pointer transition-transform ${
              open && "rotate-0"
            }`}
          />
          <img
            src="/SproutText.svg"
            className={`cursor-pointer transition-transform ${
              !open && "d-none"
            }`}
          />
        </div>
        <ul className="nav flex-column pt-3">
          {Menus.map((Menu, index) => (
            <a href={Menu.href} key={index} className="nav-link p-0">
              <li
                className={`nav-item d-flex align-items-center gap-3 my-2 py-2 ps-3 rounded ${
                  Menu.gap ? "mt-4" : "mt-2"
                } ${
                  activeItem === index
                    ? "bg-primary text-white"
                    : "text-primary"
                } ${
                  activeItem !== index && "hover-bg-primary hover-text-white"
                }`}
              >
                <img
                  src={Menu.src}
                  className={`nav-icon ${activeItem === index ? "active" : ""}`}
                />
                <span
                  className={`menu-title ${!open && "d-none"} ${
                    activeItem === index ? "text-white" : "text-primary"
                  }`}
                >
                  {Menu.title}
                </span>
              </li>
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNavBar;
