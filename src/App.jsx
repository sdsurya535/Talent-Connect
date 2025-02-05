import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import PrivateRoute from "./routes/PrivateRoute";
import { routes } from "./routes/routes";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import ErrorBoundary from "./components/shared/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {routes.map((route) => {
                if (route.children) {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        route.private ? (
                          <PrivateRoute>
                            <route.element />
                          </PrivateRoute>
                        ) : (
                          <route.element />
                        )
                      }
                    >
                      {route.children.map((child) => (
                        <Route
                          key={child.path}
                          path={child.path}
                          element={
                            <PrivateRoute requiredRoles={child.roles}>
                              <child.element />
                            </PrivateRoute>
                          }
                        />
                      ))}
                    </Route>
                  );
                }

                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      route.private ? (
                        <PrivateRoute requiredRoles={route.roles}>
                          <route.element />
                        </PrivateRoute>
                      ) : (
                        <route.element />
                      )
                    }
                  />
                );
              })}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
