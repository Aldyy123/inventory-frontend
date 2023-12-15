"use client";

import Link from "next/link";
import { useState } from "react";
import "boxicons";

const Sidebar = () => {
  const MenuItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    return (
      <li>
        {item.path ? (
          <Link href={item.path}>
            <i className="left">
              <box-icon name={item.icon}></box-icon>
            </i>{" "}
            {item.label}
          </Link>
        ) : (
          <span onClick={handleToggle}>
            <i className="left">
              <box-icon name={item.icon}></box-icon>
            </i>{" "}
            {item.label}{" "}
            <i className="right">
              <box-icon name="chevron-down"></box-icon>
            </i>
          </span>
        )}

        {item.children && (
          <ul style={{ display: isOpen ? "block" : "none" }}>
            {item.children.map((child, index) => (
              <MenuItem key={index} item={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  const menuData = [
    {
      label: "Home",
      path: "/home",
      icon: "home",
    },
    {
      label: "Items",
      icon: "archive",
      children: [
        { label: "Stock", path: "/items/stock" },
        { label: "Orders Items", path: "/items/orders" },
        { label: "Request Items", path: "/items/requests" },
      ],
    },
    {
      label: "Employee",
      icon: "user",
      children: [
        { label: "All Employee", path: "/employee" },
        { label: "Add Employee", path: "/employee/add-employee" },
      ],
    },
  ];
  const menuData2 = [
    {
      label: "Home",
      path: "/home",
      icon: "home",
    },
    {
      label: "Items",
      icon: "archive",
      children: [
        { label: "Stock", path: "/items/stock" },
        { label: "Requests Items", path: "/items/requests" },
        { label: "Orders Items Status", path: "/items/orders" },
      ],
    },
  ];

  return (
    <>
      <h3>PT Multi Makmur Lemindo Tbk</h3>

      {/* <ul>
        {menuData.map((item, index) =>
          localStorage.getItem("role") == "employee" ? (
            index !== menuData.length - 1 && (
              <MenuItem key={index} item={item} />
            )
          ) : (
            <MenuItem key={index} item={item} />
          )
        )}
      </ul> */}
      <ul>
        {localStorage.getItem("role") == "employee"
          ? menuData2.map((item, index) => <MenuItem key={index} item={item} />)
          : menuData.map((item, index) => <MenuItem key={index} item={item} />)}
      </ul>
    </>
  );
};

export default Sidebar;
