"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Search, User, Package, Plus, Trash2, 
  RefreshCw, Check, Percent, Truck, CreditCard, DollarSign,
  ShieldAlert, Calculator, FileText, CheckCircle2, ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  codPro: number;
  nome: string;
  codigo: string;
  qty: number;
  preco: number;
  desconto: number; // real value discount
  cfop: string;
  icmsPercent: number;
  ipiPercent: number;
  estoqueDisponivel: number;
}

export default function NovaVendaPage() {
  const router = useRouter();

  // General state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Vendedor / Representative Default
  const [codRep, setCodRep] = useState<number>(999);
  const [comissaoPercent, setComissaoPercent] = useState<number>(5.0);

  // Client State
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [clientList, setClientList] = useState<any[]>([]);
  const [isClientsLoading, setIsClientsLoading] = useState(false);

  // Client Address & Limit Override (for visual ERP completeness)
  const [shippingAddress, setShippingAddress] = useState({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });
  const [creditLimit, setCreditLimit] = useState({
    limite: 50000.0,
    utilizado: 12450.0,
    disponivel: 37550.0,
  });

  // Product Selection & Add Item Form
  const [productSearch, setProductSearch] = useState("");
  const [productList, setProductList] = useState<any[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Add Item Details
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemDiscount, setItemDiscount] = useState<number>(0); // fixed amount
  const [itemCfop, setItemCfop] = useState<string>("5.102"); // default CFOP Venda
  const [itemIcms, setItemIcms] = useState<number>(18.0); // default 18% ICMS
  const [itemIpi, setItemIpi] = useState<number>(0.0); // default 0% IPI

  // Shopping Cart List
  const [cart, setCart] = useState<CartItem[]>([]);

  // Logistics & Freight
  const [freightType, setFreightType] = useState<"CIF" | "FOB" | "NENHUM">("NENHUM");
  const [carrier, setCarrier] = useState<string>("Manual/Retirada");
  const [freightValue, setFreightValue] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [totalVolumes, setTotalVolumes] = useState<number>(0);
  const [trackingCode, setTrackingCode] = useState<string>("");

  // Financial Fechamento
  const [paymentCondition, setPaymentCondition] = useState<string>("30_DIAS");
  const [paymentMethod, setPaymentMethod] = useState<string>("Duplicata");
  const [financialAccount, setFinancialAccount] = useState<string>("Itaú Corporate - Ag. 5678");
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);

  // Observações
  const [obsInterna, setObsInterna] = useState("");
  const [obsNf, setObsNf] = useState("");

  // Sale status: Finalizado (baixa estoque) or Pendente (reserva)
  const [saleStatus, setSaleStatus] = useState<"Pendente" | "Finalizado">("Finalizado");

  // Load clients list based on autocomplete search
  useEffect(() => {
    if (!clientSearch.trim()) {
      setClientList([]);
      return;
    }
    const fetchClients = async () => {
      setIsClientsLoading(true);
      try {
        const res = await fetch(`/api/clientes?search=${encodeURIComponent(clientSearch)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setClientList(data.items || []);
        }
      } catch (err) {
        console.error("Error loading clients list:", err);
      } finally {
        setIsClientsLoading(false);
      }
    };

    const handler = setTimeout(fetchClients, 250);
    return () => clearTimeout(handler);
  }, [clientSearch]);

  // Load products list based on autocomplete search
  useEffect(() => {
    if (!productSearch.trim()) {
      setProductList([]);
      return;
    }
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      try {
        const res = await fetch(`/api/estoque?search=${encodeURIComponent(productSearch)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setProductList(data.items || []);
        }
      } catch (err) {
        console.error("Error loading products list:", err);
      } finally {
        setIsProductsLoading(false);
      }
    };

    const handler = setTimeout(fetchProducts, 250);
    return () => clearTimeout(handler);
  }, [productSearch]);

  // Auto-fill address details when a client is selected
  const handleSelectClient = (cli: any) => {
    setSelectedClient(cli);
    setShippingAddress({
      logradouro: cli.endereco || "",
      numero: cli.numero || "S/N",
      complemento: cli.complemento || "",
      bairro: cli.bairro || "",
      cidade: cli.cidade || "",
      estado: cli.estado || "",
      cep: cli.cep || "",
    });
    setClientSearch("");
    setClientList([]);
  };

  // Prepare product details when a product is clicked in search list
  const handleSelectProduct = (prod: any) => {
    setSelectedProduct(prod);
    setItemPrice(prod.preco);
    setItemQty(1);
    setItemDiscount(0);
    // Dynamic CFOP selection helper
    if (prod.categoria === "Serviços" || prod.servico === "S") {
      setItemCfop("5.933");
      setItemIcms(0);
      setItemIpi(0);
    } else {
      setItemCfop("5.102");
      setItemIcms(18.0);
      setItemIpi(0.0);
    }
    setProductSearch("");
    setProductList([]);
  };

  // Add selected product details to cart list
  const handleAddItemToCart = () => {
    if (!selectedProduct) return;

    // Verify if item has already been added to update details
    const existing = cart.find(c => c.codPro === selectedProduct.id);
    if (existing) {
      setCart(cart.map(c => c.codPro === selectedProduct.id ? { 
        ...c, 
        qty: c.qty + itemQty, 
        desconto: c.desconto + itemDiscount 
      } : c));
    } else {
      setCart([
        ...cart,
        {
          codPro: selectedProduct.id,
          nome: selectedProduct.nome,
          codigo: selectedProduct.codigo,
          qty: itemQty,
          preco: itemPrice,
          desconto: itemDiscount,
          cfop: itemCfop,
          icmsPercent: itemIcms,
          ipiPercent: itemIpi,
          estoqueDisponivel: selectedProduct.disponivel !== undefined ? selectedProduct.disponivel : selectedProduct.estoque,
        }
      ]);
    }

    // Recalculate weights and volumes dynamically for professional logistics feel
    setTotalWeight(prev => Number((prev + (0.85 * itemQty)).toFixed(2)));
    setTotalVolumes(prev => prev + itemQty);

    // Reset product select fields
    setSelectedProduct(null);
    setItemQty(1);
    setItemPrice(0);
    setItemDiscount(0);
  };

  const handleRemoveFromCart = (codPro: number, qty: number) => {
    setCart(cart.filter(item => item.codPro !== codPro));
    setTotalWeight(prev => Math.max(0, Number((prev - (0.85 * qty)).toFixed(2))));
    setTotalVolumes(prev => Math.max(0, prev - qty));
  };

  const updateCartQty = (codPro: number, qty: number) => {
    if (qty <= 0) return;
    setCart(cart.map(item => item.codPro === codPro ? { ...item, qty } : item));
  };

  // REAL-TIME FINANCIAL MATHEMATICS
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.preco * item.qty) - (item.desconto), 0);
  const globalDiscountValue = Number((cartSubtotal * (globalDiscountPercent / 100)).toFixed(2));
  
  // Tax simulations for enterprise Danfe fidelity
  const simulatedIcms = cart.reduce((sum, item) => {
    const itemSub = (item.preco * item.qty) - item.desconto;
    return sum + (itemSub * (item.icmsPercent / 100));
  }, 0);
  const simulatedIpi = cart.reduce((sum, item) => {
    const itemSub = (item.preco * item.qty) - item.desconto;
    return sum + (itemSub * (item.ipiPercent / 100));
  }, 0);
  const simulatedTaxesTotal = simulatedIcms + simulatedIpi;

  // Final NET invoice value
  const invoiceTotal = Math.max(0, cartSubtotal - globalDiscountValue + freightValue);

  // Dynamic D+N Installments Schedule Generator
  const generateInstallments = () => {
    const list: Array<{ number: number; date: string; value: number }> = [];
    const today = new Date();

    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result.toLocaleDateString("pt-BR");
    };

    switch (paymentCondition) {
      case "A_VISTA":
        list.push({ number: 1, date: today.toLocaleDateString("pt-BR"), value: invoiceTotal });
        break;
      case "15_DIAS":
        list.push({ number: 1, date: addDays(today, 15), value: invoiceTotal });
        break;
      case "30_DIAS":
        list.push({ number: 1, date: addDays(today, 30), value: invoiceTotal });
        break;
      case "30_60_DIAS":
        list.push({ number: 1, date: addDays(today, 30), value: Number((invoiceTotal / 2).toFixed(2)) });
        list.push({ number: 2, date: addDays(today, 60), value: Number((invoiceTotal / 2).toFixed(2)) });
        break;
      case "30_60_90_DIAS":
        list.push({ number: 1, date: addDays(today, 30), value: Number((invoiceTotal / 3).toFixed(2)) });
        list.push({ number: 2, date: addDays(today, 60), value: Number((invoiceTotal / 3).toFixed(2)) });
        list.push({ number: 3, date: addDays(today, 90), value: Number((invoiceTotal / 3).toFixed(2)) });
        break;
      case "30_60_90_120_DIAS":
        list.push({ number: 1, date: addDays(today, 30), value: Number((invoiceTotal / 4).toFixed(2)) });
        list.push({ number: 2, date: addDays(today, 60), value: Number((invoiceTotal / 4).toFixed(2)) });
        list.push({ number: 3, date: addDays(today, 90), value: Number((invoiceTotal / 4).toFixed(2)) });
        list.push({ number: 4, date: addDays(today, 120), value: Number((invoiceTotal / 4).toFixed(2)) });
        break;
      default:
        list.push({ number: 1, date: today.toLocaleDateString("pt-BR"), value: invoiceTotal });
    }
    return list;
  };

  const installmentsSchedule = generateInstallments();

  // Submit and Save the faturamento commercial
  const handleSubmitInvoice = async () => {
    if (!selectedClient) {
      setFormError("É obrigatório selecionar um cliente para faturamento.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (cart.length === 0) {
      setFormError("É necessário incluir ao menos 1 item físico no pedido.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Verify stock availability if faturado physically
    if (saleStatus === "Finalizado") {
      const outOfStockItem = cart.find(item => item.qty > item.estoqueDisponivel);
      if (outOfStockItem) {
        setFormError(
          `Estoque insuficiente para o produto "${outOfStockItem.nome}". Quantidade disponível: ${outOfStockItem.estoqueDisponivel} un. Por favor, ajuste a quantidade ou mude o status para Reserva (Pendente).`
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const response = await fetch("/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codCli: selectedClient.id,
          clienteName: selectedClient.nome,
          status: saleStatus,
          codRep: codRep,
          items: cart.map(item => ({
            codPro: item.codPro,
            qty: item.qty,
            preco: item.preco - (item.desconto / item.qty) // net unit price saved
          }))
        })
      });

      if (response.ok) {
        setFormSuccess("Faturamento gravado com sucesso! Sincronizando dados com o SQL Server...");
        setTimeout(() => {
          router.push("/dashboard/vendas");
        }, 1500);
      } else {
        const errData = await response.json();
        setFormError(errData.error || "Falha na transação comercial do banco.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Communication error saving commercial invoice:", err);
      setFormError("Erro de comunicação com o servidor de banco de dados.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-20 text-slate-100 relative">
      
      {/* Top action header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <Link href="/dashboard/vendas" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-3 w-3" /> Registro de Vendas
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-300">Novo Faturamento</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-400" /> Registrar Faturamento Comercial
          </h2>
          <p className="text-xs text-muted-foreground leading-snug">
            Emissão corporativa de saídas comerciais, baixa integrada de prateleiras físicas, logística e parcelamentos.
          </p>
        </div>

        {/* Action Header Button Controls */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/vendas">
            <Button variant="secondary" size="sm" className="text-xs font-semibold h-8.5 border border-border bg-[#101524]">
              Cancelar
            </Button>
          </Link>
          <Button 
            onClick={handleSubmitInvoice}
            disabled={isSubmitting}
            className="text-xs font-extrabold h-8.5 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Faturando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Faturar Pedido
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Global Message banners */}
      {formError && (
        <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-shake">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400 animate-pulse" />
          <div className="space-y-0.5">
            <p className="font-extrabold uppercase tracking-wide">Bloqueio de Operação Comercial</p>
            <p className="text-slate-300 font-semibold">{formError}</p>
          </div>
        </div>
      )}

      {formSuccess && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 animate-bounce" />
          <div className="space-y-0.5">
            <p className="font-extrabold uppercase tracking-wide">Transação Aprovada</p>
            <p className="text-slate-300 font-semibold">{formSuccess}</p>
          </div>
        </div>
      )}

      {/* Main Split Screen Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Inputs Panel (Span 2) */}
        <div className="xl:col-span-2 space-y-6">

          {/* CARD 1: CLIENT SELECTION & BILLING DATA */}
          <Card className="bg-[#0E1322]/80 border border-border/50 shadow-xl backdrop-blur-md overflow-visible relative">
            <CardHeader className="p-4 border-b border-border/30 bg-[#070A12]/30">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 flex items-center justify-center">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-xs font-bold text-slate-200">1. Identificação do Cliente & Faturamento</CardTitle>
                  <CardDescription className="text-[10px] text-muted-foreground">Vincule o comprador e gerencie o limite corporativo de faturamento direto.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {selectedClient ? (
                /* Selected Client state */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-xl bg-[#090D18]/90 border border-emerald-500/35 relative overflow-hidden">
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        <h4 className="text-sm font-extrabold text-emerald-400">{selectedClient.nome}</h4>
                        <span className="text-[9px] text-muted-foreground font-mono">ID: #{selectedClient.id}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-semibold text-slate-300">
                        <div>CNPJ/CPF: <span className="font-bold text-slate-100">{selectedClient.cnpj || selectedClient.cpf || "Consumidor Final"}</span></div>
                        <div>E-mail: <span className="font-bold text-slate-100">{selectedClient.email || "Sem e-mail"}</span></div>
                        <div>Telefone: <span className="font-bold text-slate-100">{selectedClient.telefone || "Sem telefone"}</span></div>
                        <div>Inscrição Est.: <span className="font-bold text-slate-100">{selectedClient.ie || "Isento"}</span></div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-border/40 pt-2 sm:pt-0 sm:pl-4">
                      <div className="text-right">
                        <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block">Limite de Crédito</span>
                        <span className="text-sm font-black text-slate-100">{creditLimit.disponivel.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                        <span className="text-[8px] text-muted-foreground block">de {creditLimit.limite.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} total</span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setSelectedClient(null)}
                        variant="ghost"
                        className="h-7 px-3 hover:bg-rose-950/20 text-rose-400 border border-rose-500/10 text-[10px] font-bold self-start sm:self-auto"
                      >
                        Trocar Cliente
                      </Button>
                    </div>
                  </div>

                  {/* Complete editable shipping address fields */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Endereço de Faturamento & Entrega</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[9px] text-muted-foreground font-bold">Logradouro / Rua</label>
                        <Input
                          value={shippingAddress.logradouro}
                          onChange={(e) => setShippingAddress({...shippingAddress, logradouro: e.target.value})}
                          placeholder="Ex: Av das Nações"
                          className="h-8.5 text-xs font-semibold bg-[#05080E]/70"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted-foreground font-bold">Número</label>
                        <Input
                          value={shippingAddress.numero}
                          onChange={(e) => setShippingAddress({...shippingAddress, numero: e.target.value})}
                          placeholder="Ex: 120"
                          className="h-8.5 text-xs font-semibold bg-[#05080E]/70"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted-foreground font-bold">Bairro</label>
                        <Input
                          value={shippingAddress.bairro}
                          onChange={(e) => setShippingAddress({...shippingAddress, bairro: e.target.value})}
                          placeholder="Ex: Centro"
                          className="h-8.5 text-xs font-semibold bg-[#05080E]/70"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted-foreground font-bold">Cidade</label>
                        <Input
                          value={shippingAddress.cidade}
                          onChange={(e) => setShippingAddress({...shippingAddress, cidade: e.target.value})}
                          placeholder="Ex: São Paulo"
                          className="h-8.5 text-xs font-semibold bg-[#05080E]/70"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-muted-foreground font-bold">UF</label>
                          <Input
                            value={shippingAddress.estado}
                            onChange={(e) => setShippingAddress({...shippingAddress, estado: e.target.value})}
                            placeholder="SP"
                            maxLength={2}
                            className="h-8.5 text-xs font-semibold text-center bg-[#05080E]/70"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-muted-foreground font-bold">CEP</label>
                          <Input
                            value={shippingAddress.cep}
                            onChange={(e) => setShippingAddress({...shippingAddress, cep: e.target.value})}
                            placeholder="01234-567"
                            className="h-8.5 text-xs font-semibold bg-[#05080E]/70"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Unselected Client live lookup input */
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="Comece a digitar para pesquisar clientes cadastrados..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="h-10 pl-9.5 pr-4 border-border bg-[#05080E]/90 text-xs font-semibold focus:border-emerald-500"
                  />
                  {isClientsLoading && (
                    <div className="absolute right-3 top-3.5 text-xs text-muted-foreground flex items-center gap-1">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    </div>
                  )}
                  
                  {clientSearch.trim().length > 0 && clientList.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-[#121826] border border-border rounded-xl shadow-2xl divide-y divide-border/20">
                      {clientList.map((cli) => (
                        <button
                          key={cli.id}
                          type="button"
                          onClick={() => handleSelectClient(cli)}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center justify-between"
                        >
                          <div className="space-y-0.5">
                            <span className="block font-bold">{cli.nome}</span>
                            <span className="block text-[8px] text-muted-foreground font-mono">CPF/CNPJ: {cli.cnpj || cli.cpf || "Sem doc"}</span>
                          </div>
                          <Badge className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/10">ID: #{cli.id}</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CARD 2: SHOPPING CART & INVENTORY SEARCH */}
          <Card className="bg-[#0E1322]/80 border border-border/50 shadow-xl backdrop-blur-md overflow-visible relative">
            <CardHeader className="p-4 border-b border-border/30 bg-[#070A12]/30">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 flex items-center justify-center">
                  <Package className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-xs font-bold text-slate-200">2. Grade de Itens do Pedido (Produtos/Serviços)</CardTitle>
                  <CardDescription className="text-[10px] text-muted-foreground">Insira as referências SKU, quantidades, preços comerciais e descontos.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Product Lookup Input */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Search className="h-4 w-4" />
                </span>
                <Input
                  type="text"
                  placeholder="Pesquise produtos por código SKU, referência ou descrição de prateleira..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="h-10 pl-9.5 pr-4 border-border bg-[#05080E]/90 text-xs font-semibold focus:border-emerald-500"
                />
                {isProductsLoading && (
                  <div className="absolute right-3 top-3.5 text-xs text-muted-foreground flex items-center gap-1">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  </div>
                )}

                {productSearch.trim().length > 0 && productList.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-[#121826] border border-border rounded-xl shadow-2xl divide-y divide-border/20">
                    {productList.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleSelectProduct(prod)}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="block font-bold">{prod.nome}</span>
                          <span className="block text-[8px] text-muted-foreground font-mono">Ref SKU: {prod.codigo} -- Estoque Atual: <strong className="text-slate-300 font-extrabold">{prod.disponivel !== undefined ? prod.disponivel : prod.estoque} un</strong></span>
                        </div>
                        <span className="text-emerald-400 font-black">{prod.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Product Addition Detail Card */}
              {selectedProduct && (
                <div className="p-4 rounded-xl bg-[#090D18]/90 border border-border/60 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-100">{selectedProduct.nome}</h5>
                      <span className="text-[9px] text-muted-foreground font-mono">Referência: {selectedProduct.codigo} -- Disponível em Estoque: {selectedProduct.disponivel !== undefined ? selectedProduct.disponivel : selectedProduct.estoque} un</span>
                    </div>
                    <Button 
                      type="button" 
                      onClick={() => setSelectedProduct(null)} 
                      variant="ghost" 
                      className="h-6 w-6 p-0 hover:bg-rose-950/20 text-rose-400"
                    >
                      X
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    {/* Quantity */}
                    <div>
                      <label className="text-[9px] text-muted-foreground font-bold">Quantidade</label>
                      <Input
                        type="number"
                        min={1}
                        value={itemQty}
                        onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="h-8 text-xs font-bold text-center bg-[#0F1420]"
                      />
                    </div>

                    {/* Commercial Unit Price */}
                    <div>
                      <label className="text-[9px] text-muted-foreground font-bold">Preço Unitário</label>
                      <Input
                        type="number"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="h-8 text-xs font-bold bg-[#0F1420]"
                      />
                    </div>

                    {/* fixed discount per unit */}
                    <div>
                      <label className="text-[9px] text-muted-foreground font-bold">Desc. Unit. (R$)</label>
                      <Input
                        type="number"
                        value={itemDiscount}
                        onChange={(e) => setItemDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="h-8 text-xs font-bold bg-[#0F1420]"
                      />
                    </div>

                    {/* CFOP Select list */}
                    <div>
                      <label className="text-[9px] text-muted-foreground font-bold">Cód. CFOP</label>
                      <select
                        value={itemCfop}
                        onChange={(e) => setItemCfop(e.target.value)}
                        className="w-full h-8 rounded bg-[#0F1420] border border-border/80 px-2 py-0.5 text-[10px] font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="5.102">5.102 - Venda Mercadoria</option>
                        <option value="5.405">5.405 - Venda Subst. Tributária</option>
                        <option value="5.933">5.933 - Prestação de Serviço</option>
                        <option value="5.124">5.124 - Industrialização</option>
                      </select>
                    </div>

                    {/* Taxes Simulation Display */}
                    <div>
                      <label className="text-[9px] text-muted-foreground font-bold">Aliquota ICMS (%)</label>
                      <Input
                        type="number"
                        value={itemIcms}
                        onChange={(e) => setItemIcms(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="h-8 text-xs font-bold bg-[#0F1420]"
                      />
                    </div>

                    {/* IPI Percent */}
                    <div>
                      <label className="text-[9px] text-muted-foreground font-bold">Aliquota IPI (%)</label>
                      <Input
                        type="number"
                        value={itemIpi}
                        onChange={(e) => setItemIpi(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="h-8 text-xs font-bold bg-[#0F1420]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/45 p-3 rounded-lg border border-border/30">
                    <div className="text-xs font-bold text-slate-300">
                      Subtotal Item: <span className="text-slate-100 font-extrabold">{((itemPrice * itemQty) - (itemDiscount * itemQty)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleAddItemToCart}
                      className="h-8 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Incluir no Carrinho
                    </Button>
                  </div>
                </div>
              )}

              {/* Shopping Cart Table List */}
              <div className="space-y-1.5 pt-3">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Lista de Itens Lançados</span>
                {cart.length === 0 ? (
                  <div className="bg-[#05080E]/60 border border-border/40 p-10 rounded-xl text-center text-xs text-muted-foreground font-semibold flex flex-col items-center justify-center gap-2">
                    <Package className="h-6 w-6 text-muted-foreground/50 animate-pulse" />
                    <span>Nenhum item adicionado à fatura. Pesquise e adicione acima.</span>
                  </div>
                ) : (
                  <div className="border border-border/40 rounded-xl overflow-hidden bg-[#05080E]/60">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/40 bg-slate-950/50 font-bold text-muted-foreground uppercase text-[8px] tracking-wider">
                          <th className="p-2.5 pl-4">Item</th>
                          <th className="p-2.5">Código SKU</th>
                          <th className="p-2.5 text-center w-24">Qtd</th>
                          <th className="p-2.5 text-right">Unitário</th>
                          <th className="p-2.5 text-right">Desc. Item</th>
                          <th className="p-2.5 text-center">CFOP / Impostos</th>
                          <th className="p-2.5 text-right">Subtotal</th>
                          <th className="p-2.5 pr-4 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {cart.map((item, idx) => (
                          <tr key={item.codPro} className="hover:bg-slate-900/35 transition-colors">
                            <td className="p-3 pl-4 font-bold text-slate-200">
                              <div className="flex flex-col gap-0.5">
                                <span>{item.nome}</span>
                                <span className="text-[8px] text-muted-foreground font-normal">Item #{idx + 1}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-cyan-400 font-bold">{item.codigo}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <input
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => updateCartQty(item.codPro, parseInt(e.target.value) || 1)}
                                  className="w-14 h-7 text-center rounded bg-[#121826] border border-border/60 text-xs font-black text-slate-100"
                                />
                                <span className="text-[9px] text-muted-foreground font-semibold">un</span>
                              </div>
                            </td>
                            <td className="p-3 text-right font-semibold text-slate-300">
                              {item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </td>
                            <td className="p-3 text-right font-bold text-rose-400">
                              {item.desconto > 0 ? `-${item.desconto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}` : "R$ 0,00"}
                            </td>
                            <td className="p-3 text-center text-[9px] text-slate-300 font-semibold space-y-0.5">
                              <span className="block font-mono font-bold text-indigo-400 bg-indigo-950/20 px-1 py-0.5 rounded border border-indigo-500/10">{item.cfop}</span>
                              <span className="block text-muted-foreground">ICMS: {item.icmsPercent}% | IPI: {item.ipiPercent}%</span>
                            </td>
                            <td className="p-3 text-right font-black text-slate-100">
                              {((item.preco * item.qty) - item.desconto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </td>
                            <td className="p-3 pr-4 text-right">
                              <Button
                                type="button"
                                onClick={() => handleRemoveFromCart(item.codPro, item.qty)}
                                variant="ghost"
                                className="h-7 w-7 p-0 text-rose-400 hover:bg-rose-950/25 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: LOGISTICS, CARRIER & FREIGHT */}
          <Card className="bg-[#0E1322]/80 border border-border/50 shadow-xl backdrop-blur-md">
            <CardHeader className="p-4 border-b border-border/30 bg-[#070A12]/30">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 flex items-center justify-center">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-xs font-bold text-slate-200">3. Logística, Cubagem & Expedição</CardTitle>
                  <CardDescription className="text-[10px] text-muted-foreground">Especifique a modalidade de entrega, pesos físicos e transportadora.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                {/* Freight modal CIF/FOB */}
                <div>
                  <label className="text-[9px] text-muted-foreground font-bold block mb-1">Modalidade Frete</label>
                  <select
                    value={freightType}
                    onChange={(e) => setFreightType(e.target.value as any)}
                    className="w-full h-8.5 rounded bg-[#05080E]/70 border border-border/80 px-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="NENHUM">Sem Frete (Retirada)</option>
                    <option value="CIF">CIF (Emitente/Pago)</option>
                    <option value="FOB">FOB (Destinatário/Faturar)</option>
                  </select>
                </div>

                {/* Carrier / Transportadora select */}
                <div>
                  <label className="text-[9px] text-muted-foreground font-bold block mb-1">Transportadora Parceira</label>
                  <select
                    value={carrier}
                    disabled={freightType === "NENHUM"}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full h-8.5 rounded bg-[#05080E]/70 border border-border/80 px-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                  >
                    <option value="Manual/Retirada">Manual / Retirada Local</option>
                    <option value="Correios_PAC">Correios PAC</option>
                    <option value="Correios_Sedex">Correios Sedex</option>
                    <option value="Jamef_Logistica">Jamef Logística</option>
                    <option value="Jadlog_Express">Jadlog Express</option>
                    <option value="TNT_Mercurio">TNT Mercúrio</option>
                  </select>
                </div>

                {/* Freight Value Input (impacts totals) */}
                <div>
                  <label className="text-[9px] text-muted-foreground font-bold block mb-1">Valor Frete Comercial (R$)</label>
                  <Input
                    type="number"
                    disabled={freightType === "NENHUM"}
                    value={freightValue}
                    onChange={(e) => setFreightValue(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="h-8.5 text-xs font-bold bg-[#05080E]/70 disabled:opacity-50"
                  />
                </div>

                {/* Tracking / Rastreio */}
                <div>
                  <label className="text-[9px] text-muted-foreground font-bold block mb-1">Código de Rastreamento</label>
                  <Input
                    type="text"
                    disabled={freightType === "NENHUM"}
                    placeholder="Ex: BR8829182928X"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="h-8.5 text-xs font-semibold bg-[#05080E]/70 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Cubagem simulator footer details */}
              <div className="mt-4 pt-3 border-t border-border/30 grid grid-cols-2 gap-4 text-[10px] text-muted-foreground font-semibold">
                <div>
                  Cubagem Estimada: <strong className="text-slate-300">{(totalVolumes * 0.015).toFixed(3)} m³</strong>
                </div>
                <div className="text-right">
                  Peso Bruto Estimado: <strong className="text-slate-300">{totalWeight} kg</strong> | Volumes: <strong className="text-slate-300">{totalVolumes} un</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Summary & Closing Panel (Span 1) */}
        <div className="space-y-6">

          {/* CARD 4: REAL-TIME FINANCIAL SUMMARY */}
          <Card className="bg-[#0E1322]/80 border border-border/50 shadow-xl backdrop-blur-md relative overflow-hidden">
            {/* Glowing background accent */}
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <CardHeader className="p-4 border-b border-border/30 bg-[#070A12]/30">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-xs font-bold text-slate-200">Resumo da Fatura Comercial</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              <div className="space-y-2 border-b border-border/30 pb-3 text-xs font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal dos Itens:</span>
                  <span className="font-bold text-slate-100">{cartSubtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <span>Desconto Global (%):</span>
                  <div className="flex items-center gap-1.5 w-24 shrink-0">
                    <Input
                      type="number"
                      max={100}
                      min={0}
                      value={globalDiscountPercent}
                      onChange={(e) => setGlobalDiscountPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="h-7 text-xs font-bold text-center bg-[#05080E]/70 p-1"
                    />
                    <span className="text-[10px] text-muted-foreground font-extrabold">%</span>
                  </div>
                </div>

                {globalDiscountValue > 0 && (
                  <div className="flex justify-between text-rose-400 font-bold pl-3">
                    <span>↳ Valor do Desconto:</span>
                    <span>-{globalDiscountValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Custo Adicional Frete:</span>
                  <span className="font-bold text-slate-100">{freightValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/10">
                  <span>Tributos Estimados (ICMS+IPI):</span>
                  <span>{simulatedTaxesTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>

              {/* Large NET Invoice Value Glow */}
              <div className="p-4 rounded-xl bg-slate-950/75 border border-border/50 text-center space-y-1 relative shadow-inner">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-wider block">Valor Total Líquido a Receber</span>
                <span className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] block font-mono">
                  {invoiceTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
                <span className="text-[8px] text-emerald-400/80 font-bold block animate-pulse-slow">● Faturamento Integrado Caixa/Banco</span>
              </div>
            </CardContent>
          </Card>

          {/* CARD 5: FINANCIAL PAYMENT CONDITION & PARCELADOR */}
          <Card className="bg-[#0E1322]/80 border border-border/50 shadow-xl backdrop-blur-md">
            <CardHeader className="p-4 border-b border-border/30 bg-[#070A12]/30">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 flex items-center justify-center">
                  <CreditCard className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-xs font-bold text-slate-200">Condições Comerciais & Financeiras</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Payment Condition selector */}
              <div>
                <label className="text-[9px] text-muted-foreground font-bold block mb-1">Condição de Pagamento</label>
                <select
                  value={paymentCondition}
                  onChange={(e) => setPaymentCondition(e.target.value)}
                  className="w-full h-8.5 rounded bg-[#05080E]/70 border border-border/80 px-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="A_VISTA">À Vista (1x)</option>
                  <option value="15_DIAS">15 Dias</option>
                  <option value="30_DIAS">30 Dias</option>
                  <option value="30_60_DIAS">30/60 Dias (2x)</option>
                  <option value="30_60_90_DIAS">30/60/90 Dias (3x)</option>
                  <option value="30_60_90_120_DIAS">30/60/90/120 Dias (4x)</option>
                </select>
              </div>

              {/* Payment method selector */}
              <div>
                <label className="text-[9px] text-muted-foreground font-bold block mb-1">Meio de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-8.5 rounded bg-[#05080E]/70 border border-border/80 px-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Pix">Pix Comercial</option>
                  <option value="Boleto_Bancario">Boleto Bancário</option>
                  <option value="Cartao_Credito">Cartão de Crédito</option>
                  <option value="Dinheiro">Dinheiro Físico</option>
                  <option value="Duplicata">Duplicata</option>
                </select>
              </div>

              {/* Destination Account */}
              <div>
                <label className="text-[9px] text-muted-foreground font-bold block mb-1">Conta Financeira Origem/Destino</label>
                <select
                  value={financialAccount}
                  onChange={(e) => setFinancialAccount(e.target.value)}
                  className="w-full h-8.5 rounded bg-[#05080E]/70 border border-border/80 px-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Caixa_Geral">Caixa Geral Físico</option>
                  <option value="BB">Banco do Brasil - Ag. 1234</option>
                  <option value="Itaú Corporate - Ag. 5678">Itaú Corporate - Ag. 5678</option>
                </select>
              </div>

              {/* Installments Simulation Schedule List */}
              <div className="space-y-2 border-t border-border/30 pt-3">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Fluxo de Parcelas Projetado</span>
                <div className="space-y-1.5">
                  {installmentsSchedule.map((inst) => (
                    <div key={inst.number} className="flex justify-between items-center p-2 rounded bg-slate-950/40 border border-border/20 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="h-4 w-4 rounded-full bg-slate-800 text-[9px] text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/10">{inst.number}</span>
                        <span className="text-slate-300">Duplicata Venc. {inst.date}</span>
                      </div>
                      <span className="text-emerald-400 font-extrabold font-mono">{inst.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 6: ADDITIONAL COMMENTS */}
          <Card className="bg-[#0E1322]/80 border border-border/50 shadow-xl backdrop-blur-md">
            <CardHeader className="p-4 border-b border-border/30 bg-[#070A12]/30">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-xs font-bold text-slate-200">Observações & Nota Fiscal</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-[9px] text-muted-foreground font-bold block mb-1">Observações Internas (Logística / Expedição)</label>
                <textarea
                  value={obsInterna}
                  onChange={(e) => setObsInterna(e.target.value)}
                  placeholder="Instruções para manuseio, entrega ou despacho da carga..."
                  rows={2}
                  className="w-full text-xs font-semibold p-2.5 rounded bg-[#05080E]/70 border border-border/80 focus:outline-none focus:border-emerald-500 placeholder:text-muted-foreground text-slate-200"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground font-bold block mb-1">Observações do Faturamento (DANFE)</label>
                <textarea
                  value={obsNf}
                  onChange={(e) => setObsNf(e.target.value)}
                  placeholder="Informações fiscais obrigatórias de tributação tributária..."
                  rows={2}
                  className="w-full text-xs font-semibold p-2.5 rounded bg-[#05080E]/70 border border-border/80 focus:outline-none focus:border-emerald-500 placeholder:text-muted-foreground text-slate-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* ACTION BUTTON PANEL FOR FINAL CONFIRMATION */}
          <Card className="bg-[#0E1322]/80 border border-border/50 shadow-xl backdrop-blur-md p-4 space-y-4">
            <div>
              <label className="text-[9px] text-muted-foreground font-bold block mb-1">Status de Gravação Comercial</label>
              <div className="flex gap-2 bg-[#05080E]/90 p-1.5 rounded-lg border border-border/40">
                <button
                  type="button"
                  onClick={() => setSaleStatus("Finalizado")}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded transition-all cursor-pointer ${
                    saleStatus === "Finalizado"
                      ? "bg-emerald-500 text-black shadow-md"
                      : "text-muted-foreground hover:text-slate-200"
                  }`}
                >
                  Finalizado (Baixa Física)
                </button>
                <button
                  type="button"
                  onClick={() => setSaleStatus("Pendente")}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded transition-all cursor-pointer ${
                    saleStatus === "Pendente"
                      ? "bg-amber-500 text-black shadow-md"
                      : "text-muted-foreground hover:text-slate-200"
                  }`}
                >
                  Pendente (Reserva de Carga)
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-[#05080E]/50 border border-border/30 rounded-xl p-3 text-[9px] text-muted-foreground leading-normal">
              <ShieldAlert className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse-slow" />
              <span>
                {saleStatus === "Finalizado" 
                  ? "ATENÇÃO: A gravação em lote como faturamento físico deduzirá imediatamente o saldo disponível dos produtos cadastrados no estoque do SQL Server." 
                  : "INFORMAÇÃO: A gravação gerará reserva comercial sem dar baixa física de mercadoria, bloqueando saldos para orçamento comercial."}
              </span>
            </div>

            <Button 
              onClick={handleSubmitInvoice}
              disabled={isSubmitting}
              className="w-full text-xs font-black h-11 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.15)] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  Sincronizando com o SQL Server...
                </>
              ) : (
                <>
                  <Check className="h-4.5 w-4.5" />
                  GRAVAR E EMITIR FATURA COMERCIAL
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
