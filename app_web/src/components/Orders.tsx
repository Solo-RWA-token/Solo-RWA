import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Order, ProductionMilestone } from "../types";
import {
  ArrowRight,
  Package,
  Activity,
  Zap,
  ShieldCheck,
  BadgeCheck,
  CircleDashed,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ORDERS_KEY = "solx_mock_orders";

const getMilestones = (order: Order): ProductionMilestone[] => {
  if (order.milestones?.length) {
    return order.milestones;
  }

  const byStatus: Record<Order["status"], ProductionMilestone[]> = {
    processing: [
      {
        id: "escrow",
        stage: "Escrow Contract Initialized",
        tranchePercent: 20,
        verification: "verified",
        evidence: "Escrow funding transaction confirmed",
      },
      {
        id: "pilot",
        stage: "Pilot Production Completed",
        tranchePercent: 20,
        verification: "verified",
        evidence: "QA inspection signed",
      },
      {
        id: "integration",
        stage: "Manufacturing Integration Live",
        tranchePercent: 20,
        verification: "pending",
      },
      {
        id: "shipment",
        stage: "Shipment Readiness Confirmed",
        tranchePercent: 20,
        verification: "pending",
      },
      {
        id: "delivery",
        stage: "Delivery and Acceptance Confirmed",
        tranchePercent: 20,
        verification: "pending",
      },
    ],
    confirmed: [
      {
        id: "escrow",
        stage: "Escrow Contract Initialized",
        tranchePercent: 20,
        verification: "verified",
        evidence: "Escrow funding transaction confirmed",
      },
      {
        id: "pilot",
        stage: "Pilot Production Completed",
        tranchePercent: 20,
        verification: "verified",
        evidence: "QA inspection signed",
      },
      {
        id: "integration",
        stage: "Manufacturing Integration Live",
        tranchePercent: 20,
        verification: "verified",
        evidence: "Factory integration logs + partner attestation",
      },
      {
        id: "shipment",
        stage: "Shipment Readiness Confirmed",
        tranchePercent: 20,
        verification: "pending",
      },
      {
        id: "delivery",
        stage: "Delivery and Acceptance Confirmed",
        tranchePercent: 20,
        verification: "pending",
      },
    ],
    delivered: [
      {
        id: "escrow",
        stage: "Escrow Contract Initialized",
        tranchePercent: 20,
        verification: "verified",
        evidence: "Escrow funding transaction confirmed",
      },
      {
        id: "pilot",
        stage: "Pilot Production Completed",
        tranchePercent: 20,
        verification: "verified",
        evidence: "QA inspection signed",
      },
      {
        id: "integration",
        stage: "Manufacturing Integration Live",
        tranchePercent: 20,
        verification: "verified",
        evidence: "Factory integration logs + partner attestation",
      },
      {
        id: "shipment",
        stage: "Shipment Readiness Confirmed",
        tranchePercent: 20,
        verification: "verified",
        evidence: "Logistics readiness checklist signed",
      },
      {
        id: "delivery",
        stage: "Delivery and Acceptance Confirmed",
        tranchePercent: 20,
        verification: "verified",
        evidence: "Buyer acceptance confirmation",
      },
    ],
  };

  return byStatus[order.status] ?? byStatus.processing;
};

const milestoneStatusLabel = (milestone: ProductionMilestone): "processing" | "confirmed" | "delivered" => {
  if (milestone.verification !== "verified") {
    return "processing";
  }
  if (milestone.id === "delivery") {
    return "delivered";
  }
  return "confirmed";
};

const milestoneStatusTone = (status: "processing" | "confirmed" | "delivered") => {
  if (status === "delivered") {
    return "bg-tertiary-container/10 border-tertiary-dim/30 text-tertiary-dim";
  }
  if (status === "confirmed") {
    return "bg-primary/10 border-primary/30 text-primary";
  }
  return "bg-amber-500/10 border-amber-500/30 text-amber-400";
};

export const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const storedOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]",
      ) as Order[];
      const userOrders = storedOrders.filter(
        (order) => order.userId === user.uid,
      );
      setOrders(userOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-surface-container-high w-64 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-surface-container-low rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-8 bg-tertiary"></div>
          <h2 className="font-headline text-4xl font-black tracking-tighter text-primary uppercase">
            Mission History
          </h2>
        </div>
        <p className="text-on-surface-variant font-sans text-[10px] uppercase tracking-[0.2em]">
          Clinical Asset Records / Tier 01 Access
        </p>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface-container-low p-12 rounded-xl border border-outline-variant/10 text-center"
        >
          <Package className="mx-auto text-outline-variant mb-4" size={48} />
          <h3 className="font-headline text-xl font-bold text-on-surface uppercase mb-2">
            No Deployments Detected
          </h3>
          <p className="font-sans text-sm text-on-surface-variant mb-8">
            Your fleet is currently empty. Visit the catalog to acquire assets.
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-primary to-primary-dim text-surface font-headline font-bold uppercase tracking-widest rounded-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            Browse Catalog
            <ArrowRight size={16} />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-surface-container-low p-6 hover:bg-surface-container transition-all duration-300 border border-outline-variant/10 rounded-xl"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-surface-container-high overflow-hidden shrink-0 rounded-lg">
                      <img
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                        src={order.assetImage}
                        alt={order.assetName}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] tracking-widest text-outline uppercase mb-1">
                        Asset ID: {order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <h3 className="font-headline text-2xl font-bold text-on-surface uppercase group-hover:text-primary transition-colors">
                        {order.assetName}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-sans text-xs text-on-surface-variant">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="font-headline font-bold text-primary-dim">
                          ${order.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
                        order.status === "delivered"
                          ? "bg-tertiary-container/10 border-tertiary-dim/20 text-tertiary-dim"
                          : order.status === "confirmed"
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          order.status === "delivered"
                            ? "bg-tertiary-dim animate-pulse"
                            : order.status === "confirmed"
                              ? "bg-primary"
                              : "bg-amber-500"
                        }`}
                      ></span>
                      <span className="font-sans text-[10px] font-bold tracking-widest uppercase">
                        {order.status}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedOrderId((prev) =>
                          prev === order.id ? null : order.id,
                        )
                      }
                      className="flex items-center gap-2 font-sans text-xs font-bold tracking-widest text-primary uppercase group/btn"
                    >
                      {expandedOrderId === order.id
                        ? "Hide Details"
                        : "View Details"}
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="bg-surface-container-high/60 border border-outline-variant/10 rounded-lg p-4">
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-3">
                      Escrow Release Milestones
                    </p>
                    <div className="space-y-2">
                      {getMilestones(order).map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-start justify-between gap-4 p-2 rounded bg-surface-container-low"
                        >
                          <div className="flex items-start gap-2">
                            {milestone.verification === "verified" ? (
                              <BadgeCheck
                                size={16}
                                className="text-tertiary-dim mt-0.5"
                              />
                            ) : (
                              <CircleDashed
                                size={16}
                                className="text-outline mt-0.5"
                              />
                            )}
                            <div>
                              <p className="font-sans text-xs text-on-surface uppercase tracking-wide">
                                {milestone.stage}
                              </p>
                              <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider">
                                {milestone.verification === "verified"
                                  ? `Verified - ${milestone.evidence ?? "Evidence recorded"}`
                                  : milestone.id === "shipment"
                                    ? "Pending logistics verification"
                                    : milestone.id === "delivery"
                                      ? "Pending buyer confirmation"
                                      : "Pending independent verification"}
                              </p>
                            </div>
                          </div>
                          {(() => {
                            const status = milestoneStatusLabel(milestone);
                            return (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[10px] tracking-[0.18em] font-bold uppercase ${milestoneStatusTone(status)}`}
                              >
                                {status}
                              </span>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        <div className="bg-surface-container-high/60 backdrop-blur-xl p-6 rounded-xl relative overflow-hidden border border-outline-variant/10">
          <Activity size={20} className="text-primary mb-2" />
          <span className="font-headline text-3xl font-black text-primary block">
            {orders.length.toString().padStart(2, "0")}
          </span>
          <span className="font-sans text-[10px] tracking-widest text-outline uppercase">
            Active Assets
          </span>
        </div>
        <div className="bg-surface-container-high/60 backdrop-blur-xl p-6 rounded-xl relative overflow-hidden border border-outline-variant/10">
          <Zap size={20} className="text-primary mb-2" />
          <span className="font-headline text-3xl font-black text-primary block">
            ${(orders.reduce((acc, o) => acc + o.price, 0) / 1000).toFixed(0)}K
          </span>
          <span className="font-sans text-[10px] tracking-widest text-outline uppercase">
            Total Value
          </span>
        </div>
        <div className="bg-surface-container-high/60 backdrop-blur-xl p-6 rounded-xl relative overflow-hidden border border-outline-variant/10">
          <ShieldCheck size={20} className="text-tertiary mb-2" />
          <span className="font-headline text-3xl font-black text-tertiary-dim block">
            PRO
          </span>
          <span className="font-sans text-[10px] tracking-widest text-outline uppercase">
            Member Tier
          </span>
        </div>
        <div className="bg-surface-container-high/60 backdrop-blur-xl p-6 rounded-xl relative overflow-hidden border border-outline-variant/10">
          <Activity size={20} className="text-primary mb-2" />
          <span className="font-headline text-3xl font-black text-primary block">
            2.4%
          </span>
          <span className="font-sans text-[10px] tracking-widest text-outline uppercase">
            Fleet Yield
          </span>
        </div>
      </div>
    </div>
  );
};
