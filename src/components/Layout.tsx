import { Outlet } from "react-router-dom";
import Header from "./Header";

/* Beständig layout: headern byggs INTE om vid sidbyte, så den orangea
   indikatorn kan glida mjukt mellan flikarna. Headern ligger som ett
   genomskinligt lager överst på varje sida. */
export default function Layout() {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 z-50">
        <Header />
      </div>
      <Outlet />
    </div>
  );
}
