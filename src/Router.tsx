import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

// Protected (Global)
import Overview from "./pages/Overview/Overview";
import Inbox from "./pages/Inbox/Inbox";
import AllShops from "./pages/Shops/AllShops";
import CreateShop from "./pages/Shops/CreateShop";
import Account from "./pages/Settings/Account";
import Billing from "./pages/Settings/Billing";

// Shop-specific
import ShopOverview from "./pages/Shops/ShopOverview";
import Calendar from "./pages/Bookings/Calendar";
import AllBookings from "./pages/Bookings/AllBookings";
import AddBooking from "./pages/Bookings/AddBooking";
import ServiceLibrary from "./pages/Services/ServiceLibrary";
import AllTeam from "./pages/Team/AllTeam";
import Invite from "./pages/Team/Invite";
import AllItems from "./pages/Inventory/AllItems";
import AddItem from "./pages/Inventory/AddItem";
import ShopSettings from "./pages/Settings/ShopSettings";

// Layouts
import ProtectedLayout from "./layouts/ProtectedLayout/ProtectedLayout";
import PublicLayout from "./layouts/PublicLayout/PublicLayout";
import ShopLayout from "./layouts/ShopLayout/ShopLayout"; // New layout for ShopProvider
import NotFound from "./pages/NotFound/NotFound";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ---------- PROTECTED (AUTH REQUIRED) ---------- */}
        <Route element={<ProtectedLayout />}>
          {/* Global dashboard routes */}
          <Route path="/overview" element={<Overview />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/shops" element={<AllShops />} />
          <Route path="/shops/create" element={<CreateShop />} />
          <Route path="/settings/account" element={<Account />} />
          <Route path="/settings/billing" element={<Billing />} />

          {/* ---------- SHOP ROUTES (scoped with ShopProvider) ---------- */}
          <Route path="/shops/:name" element={<ShopLayout />}>
            <Route path="overview" element={<ShopOverview />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="bookings" element={<AllBookings />} />
            <Route path="bookings/create" element={<AddBooking />} />
            <Route path="services" element={<ServiceLibrary />} />
            <Route path="team" element={<AllTeam />} />
            <Route path="team/invite" element={<Invite />} />
            <Route path="inventory" element={<AllItems />} />
            <Route path="inventory/create" element={<AddItem />} />
            <Route path="settings" element={<ShopSettings />} />
          </Route>
        </Route>

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
