import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

// Dashboard
import Overview from "./pages/Overview/Overview";

//Inbox
import Inbox from "./pages/Inbox/Inbox"

// Shops
import AllShops from "./pages/Shops/AllShops";
import CreateShop from "./pages/Shops/CreateShop";

// Team
import AllTeam from "./pages/Team/AllTeam";
import Invite from "./pages/Team/Invite";

// Services
import ServiceLibrary from "./pages/Services/ServiceLibrary";
import Assign from "./pages/Services/Assign.tsx";

// Customers
import AllCustomers from "./pages/Customers/AllCustomers";
import AddCustomer from "./pages/Customers/AddCustomer";

// Bookings
import Calendar from "./pages/Bookings/Calendar";
import AllBookings from "./pages/Bookings/AllBookings";
import AddBooking from "./pages/Bookings/AddBooking";

// Inventory
import AllItems from "./pages/Inventory/AllItems";
import AddItem from "./pages/Inventory/AddItem";

// Settings
import Account from "./pages/Settings/Account";
import ShopSettings from "./pages/Settings/ShopSettings";
import Billing from "./pages/Settings/Billing";

import NotFound from "./pages/NotFound/NotFound";

import ProtectedLayout from "./layouts/ProtectedLayout/ProtectedLayout.tsx";
import PublicLayout from "./layouts/PublicLayout/PublicLayout.tsx";
import ShopOverview from "./pages/Shops/ShopOverview.tsx";
import MainPage from "./pages/MainPage/MainPage.tsx";

export default function Router() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>  
          <Route path="/" element={<MainPage />} />  
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/shops" element={<AllShops />} />
          <Route path="/shops/create" element={<CreateShop />} />
          <Route path="/shops/:name/overview" element={<ShopOverview />} />
          <Route path="/shops/:name/team" element={<AllTeam />} />
          <Route path="/shops/:name/team/invite" element={<Invite />} />
          <Route path="/shops/:name/services" element={<ServiceLibrary />} />
          <Route path="/services/assign" element={<Assign />} />
          <Route path="/customers" element={<AllCustomers />} />
          <Route path="/customers/create" element={<AddCustomer />} />
          <Route path="/bookings" element={<AllBookings />} />
          <Route path="/bookings/calendar" element={<Calendar />} />
          <Route path="/bookings/create" element={<AddBooking />} />
          <Route path="/inventory" element={<AllItems />} />
          <Route path="/inventory/create" element={<AddItem />} />
          <Route path="/settings/account" element={<Account />} />
          <Route path="/settings/shop" element={<ShopSettings />} />
          <Route path="/settings/billing" element={<Billing />} />
        </Route>

        {/* Fallback */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
