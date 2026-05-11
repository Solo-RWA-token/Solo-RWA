import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar, BottomNav, Footer } from './components/Shared';
import { Home } from './components/Home';
import { Catalog } from './components/Catalog';
import { Hangar } from './components/Hangar';
import { Checkout } from './components/Checkout';
import { Profile } from './components/Profile';
import { OrderSuccess } from './components/OrderSuccess';
import { Login } from './components/Login';
import { Orders } from './components/Orders';
import { VehicleDetails } from './components/VehicleDetails';
import { NotFound } from './components/NotFound';
import { VEHICLES, Vehicle } from './constants';

function VehicleDetailsRoute({ cart, onAddToCart }: { cart: Vehicle[]; onAddToCart: (vehicle: Vehicle) => void }) {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [isLoading, setIsLoading] = useState(true);

  const vehicle = useMemo(() => VEHICLES.find((item) => item.id === vehicleId) ?? null, [vehicleId]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, [vehicleId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) {
    return <NotFound />;
  }

  const isInCart = cart.some((item) => item.id === vehicle.id);
  return <VehicleDetails vehicle={vehicle} onAddToCart={onAddToCart} isInCart={isInCart} />;
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState<Vehicle[]>([]);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (pendingCheckout && user) {
      setPendingCheckout(false);
      navigate('/checkout', { replace: true });
    }
  }, [user, pendingCheckout, navigate]);

  const handleAddToCart = (vehicle: Vehicle) => {
    setCart((prev) => [...prev, vehicle]);
    navigate('/hangar');
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    navigate(`/vehicle/${vehicle.id}`);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (!user) {
      setPendingCheckout(true);
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  const handleCompleteOrder = async () => {
    if (user && cart.length > 0) {
      try {
        const ORDERS_KEY = 'solx_mock_orders';
        const existingOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        const newOrders = cart.map((item) => ({
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.uid,
          assetId: item.id,
          assetName: item.name,
          assetImage: item.image,
          price: item.price,
          status: 'processing',
          createdAt: new Date().toISOString(),
        }));
        localStorage.setItem(ORDERS_KEY, JSON.stringify([...newOrders, ...existingOrders]));
      } catch (error) {
        console.error('Error saving order:', error);
      }
    }
    setCart([]);
    navigate('/success');
  };

  const handleLoginSuccess = () => {
    const from = (location.state as { from?: string } | null)?.from;
    if (pendingCheckout) {
      setPendingCheckout(false);
      navigate('/checkout', { replace: true });
      return;
    }
    navigate(from || '/', { replace: true });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hideChrome = ['/success', '/checkout', '/login'].includes(location.pathname);
  const hideFooter = hideChrome || location.pathname === '/hangar';

  return (
    <div className="min-h-screen flex flex-col">
      {location.pathname !== '/success' && (
        <Navbar currentPath={location.pathname} cartCount={cart.length} user={user} />
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/catalog"
            element={<Catalog onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />}
          />
          <Route
            path="/hangar"
            element={
              <Hangar
                cart={cart}
                onRemove={handleRemoveFromCart}
                onCheckout={handleCheckout}
                onViewDetails={handleViewDetails}
              />
            }
          />
          <Route path="/vehicle/:vehicleId" element={<VehicleDetailsRoute cart={cart} onAddToCart={handleAddToCart} />} />
          <Route
            path="/checkout"
            element={
              user ? (
                <Checkout cart={cart} onComplete={handleCompleteOrder} />
              ) : (
                <Navigate to="/login" replace state={{ from: '/checkout' }} />
              )
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route
            path="/orders"
            element={user ? <Orders /> : <Navigate to="/login" replace state={{ from: '/orders' }} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideFooter && <Footer />}

      {!hideChrome && <BottomNav currentPath={location.pathname} />}
    </div>
  );
}
