"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Activity, Calendar, Pill, Utensils, TrendingUp, Clock, AlertCircle, MessageCircle, Send, Users, Heart, Crown, Check, Star } from "lucide-react";

interface GlucoseReading {
  id: string;
  value: number;
  time: string;
  date: string;
  period: "jejum" | "pós-refeição" | "antes-refeição" | "antes-dormir";
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  taken: boolean[];
}

interface Notification {
  id: string;
  type: "medicamento" | "glicemia" | "refeição";
  title: string;
  time: string;
  completed: boolean;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  avatar: string;
}

export default function DiabetCareApp() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "subscription">("dashboard");
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([
    { id: "1", value: 95, time: "08:00", date: "2024-01-15", period: "jejum" },
    { id: "2", value: 140, time: "14:30", date: "2024-01-15", period: "pós-refeição" },
    { id: "3", value: 88, time: "18:00", date: "2024-01-14", period: "antes-refeição" },
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Metformina",
      dosage: "850mg",
      times: ["08:00", "20:00"],
      taken: [true, false]
    },
    {
      id: "2", 
      name: "Glibenclamida",
      dosage: "5mg",
      times: ["08:00"],
      taken: [true]
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", type: "medicamento", title: "Metformina 850mg", time: "20:00", completed: false },
    { id: "2", type: "glicemia", title: "Medir glicemia antes do jantar", time: "18:30", completed: false },
    { id: "3", type: "refeição", title: "Lanche da tarde", time: "15:30", completed: true },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Maria Silva",
      message: "Pessoal, descobri que caminhadas de 15 minutos após as refeições ajudam muito no controle da glicemia! Quem mais faz isso?",
      time: "14:30",
      avatar: "👩‍🦳"
    },
    {
      id: "2", 
      user: "João Santos",
      message: "Oi Maria! Eu também faço caminhadas, mas de 30 minutos. Minha glicemia melhorou muito desde que comecei essa rotina.",
      time: "14:45",
      avatar: "👨‍🦲"
    },
    {
      id: "3",
      user: "Ana Costa",
      message: "Gente, alguém tem dicas de receitas saudáveis para diabéticos? Estou enjoando das mesmas comidas...",
      time: "15:20",
      avatar: "👩"
    },
    {
      id: "4",
      user: "Carlos Lima", 
      message: "Ana, eu faço muito peixe grelhado com legumes no vapor. Fica delicioso e não afeta muito a glicemia!",
      time: "15:35",
      avatar: "👨"
    },
    {
      id: "5",
      user: "Lucia Ferreira",
      message: "Pessoal, hoje minha glicemia estava 180 após o almoço. Vocês acham que devo me preocupar? Já tomei meu medicamento certinho...",
      time: "16:10", 
      avatar: "👵"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [newGlucose, setNewGlucose] = useState("");
  const [newPeriod, setNewPeriod] = useState<GlucoseReading["period"]>("jejum");
  const [showAddGlucose, setShowAddGlucose] = useState(false);

  // Inicializar no cliente para evitar hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  // Atualizar horário atual
  useEffect(() => {
    if (!isClient) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient]);

  // Simular notificações push (em app real seria service worker)
  useEffect(() => {
    if (!isClient || !currentTime) return;

    const checkNotifications = () => {
      const now = new Date();
      const currentTimeStr = now.toTimeString().slice(0, 5);
      
      notifications.forEach(notification => {
        if (notification.time === currentTimeStr && !notification.completed) {
          // Em app real, seria uma notificação push
          console.log(`🔔 Notificação: ${notification.title}`);
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Verificar a cada minuto
    return () => clearInterval(interval);
  }, [notifications, isClient, currentTime]);

  const addGlucoseReading = () => {
    if (!newGlucose || !isClient) return;
    
    const now = new Date();
    const newReading: GlucoseReading = {
      id: Date.now().toString(),
      value: parseInt(newGlucose),
      time: now.toTimeString().slice(0, 5),
      date: now.toISOString().slice(0, 10),
      period: newPeriod
    };

    setGlucoseReadings([newReading, ...glucoseReadings]);
    setNewGlucose("");
    setShowAddGlucose(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !isClient || !currentTime) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: "Você",
      message: newMessage.trim(),
      time: currentTime.toTimeString().slice(0, 5),
      avatar: "😊"
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const markNotificationComplete = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, completed: true } : n
    ));
  };

  const getGlucoseStatus = (value: number, period: string) => {
    if (period === "jejum") {
      if (value < 70) return { status: "baixo", color: "text-blue-600" };
      if (value <= 99) return { status: "normal", color: "text-green-600" };
      if (value <= 125) return { status: "elevado", color: "text-yellow-600" };
      return { status: "alto", color: "text-red-600" };
    } else {
      if (value < 70) return { status: "baixo", color: "text-blue-600" };
      if (value <= 140) return { status: "normal", color: "text-green-600" };
      if (value <= 199) return { status: "elevado", color: "text-yellow-600" };
      return { status: "alto", color: "text-red-600" };
    }
  };

  const latestGlucose = glucoseReadings[0];
  const averageGlucose = Math.round(glucoseReadings.reduce((sum, reading) => sum + reading.value, 0) / glucoseReadings.length);
  const pendingNotifications = notifications.filter(n => !n.completed);

  // Renderizar placeholder enquanto não hidratou
  if (!isClient || !currentTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">DiabetCare</h1>
                <p className="text-gray-600">Controle inteligente do seu diabetes</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  --:--
                </div>
                <div className="text-sm text-gray-500">
                  Carregando...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">DiabetCare</h1>
              <p className="text-gray-600">Controle inteligente do seu diabetes</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {currentTime.toTimeString().slice(0, 5)}
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 flex items-center justify-center py-4 px-6 font-medium transition-colors ${
                activeTab === "dashboard" 
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Activity className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center py-4 px-6 font-medium transition-colors ${
                activeTab === "chat" 
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Comunidade
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`flex-1 flex items-center justify-center py-4 px-6 font-medium transition-colors ${
                activeTab === "subscription" 
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Crown className="h-5 w-5 mr-2" />
              Planos
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <>
            {/* Notificações Pendentes */}
            {pendingNotifications.length > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-3">
                  <Bell className="h-5 w-5 text-orange-600 mr-2" />
                  <h3 className="font-semibold text-orange-800">Lembretes Pendentes</h3>
                </div>
                <div className="space-y-2">
                  {pendingNotifications.map(notification => (
                    <div key={notification.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">{notification.time}</span>
                        <span className="ml-3 text-gray-600">{notification.title}</span>
                      </div>
                      <button
                        onClick={() => markNotificationComplete(notification.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        Concluir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cards de Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Glicemia Atual */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Última Glicemia</h3>
                  <Activity className="h-5 w-5 text-indigo-600" />
                </div>
                {latestGlucose && (
                  <div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {latestGlucose.value} <span className="text-lg text-gray-500">mg/dL</span>
                    </div>
                    <div className={`text-sm font-medium ${getGlucoseStatus(latestGlucose.value, latestGlucose.period).color}`}>
                      {getGlucoseStatus(latestGlucose.value, latestGlucose.period).status.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {latestGlucose.period} - {latestGlucose.time}
                    </div>
                  </div>
                )}
              </div>

              {/* Média Glicêmica */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Média (7 dias)</h3>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {averageGlucose} <span className="text-lg text-gray-500">mg/dL</span>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Dentro da meta
                </div>
              </div>

              {/* Medicamentos Hoje */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Medicamentos</h3>
                  <Pill className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {medications.reduce((total, med) => total + med.taken.filter(Boolean).length, 0)}/
                  {medications.reduce((total, med) => total + med.times.length, 0)}
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  Doses tomadas hoje
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registro de Glicemia */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Glicemia</h3>
                  <button
                    onClick={() => setShowAddGlucose(!showAddGlucose)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Formulário de Nova Medição */}
                {showAddGlucose && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="number"
                        placeholder="Valor (mg/dL)"
                        value={newGlucose}
                        onChange={(e) => setNewGlucose(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <select
                        value={newPeriod}
                        onChange={(e) => setNewPeriod(e.target.value as GlucoseReading["period"])}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="jejum">Jejum</option>
                        <option value="antes-refeição">Antes da refeição</option>
                        <option value="pós-refeição">Pós-refeição</option>
                        <option value="antes-dormir">Antes de dormir</option>
                      </select>
                    </div>
                    <button
                      onClick={addGlucoseReading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Registrar Medição
                    </button>
                  </div>
                )}

                {/* Lista de Medições */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {glucoseReadings.map(reading => {
                    const status = getGlucoseStatus(reading.value, reading.period);
                    return (
                      <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {reading.value} mg/dL
                          </div>
                          <div className="text-sm text-gray-500">
                            {reading.period} - {reading.time}
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${status.color}`}>
                          {status.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Medicamentos */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Medicamentos</h3>
                  <Pill className="h-5 w-5 text-purple-600" />
                </div>

                <div className="space-y-4">
                  {medications.map(medication => (
                    <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{medication.name}</h4>
                          <p className="text-sm text-gray-600">{medication.dosage}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {medication.times.map((time, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{time}</span>
                            <div className={`w-3 h-3 rounded-full ${
                              medication.taken[index] ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dicas e Alertas */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Dicas para Hoje</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">💧 Hidratação</h4>
                  <p className="text-sm text-gray-600">
                    Beba pelo menos 8 copos de água hoje. A hidratação adequada ajuda no controle da glicemia.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">🚶‍♂️ Atividade Física</h4>
                  <p className="text-sm text-gray-600">
                    Uma caminhada de 30 minutos após as refeições pode ajudar a reduzir os picos de glicose.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">🥗 Alimentação</h4>
                  <p className="text-sm text-gray-600">
                    Prefira alimentos ricos em fibras e evite carboidratos simples para manter a glicemia estável.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">😴 Sono</h4>
                  <p className="text-sm text-gray-600">
                    Durma de 7-8 horas por noite. O sono inadequado pode afetar o controle glicêmico.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Chat Content */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-2xl shadow-lg">
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Comunidade DiabetCare</h3>
                  <p className="text-sm text-gray-600">Compartilhe experiências e apoie outros usuários</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 h-96 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map(message => (
                  <div key={message.id} className={`flex ${message.user === "Você" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md ${message.user === "Você" ? "order-2" : ""}`}>
                      <div className={`flex items-center mb-1 ${message.user === "Você" ? "justify-end" : ""}`}>
                        <span className="text-xs text-gray-500 mr-2">{message.time}</span>
                        <span className="text-sm font-medium text-gray-700">{message.user}</span>
                        <span className="ml-2 text-lg">{message.avatar}</span>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.user === "Você" 
                          ? "bg-indigo-600 text-white" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Compartilhe sua experiência..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Compartilhe dicas, experiências e apoie outros usuários da comunidade
              </p>
            </div>
          </div>
        )}

        {/* Subscription Content */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            {/* Header da seção */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
              <Crown className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Planos DiabetCare</h2>
              <p className="text-indigo-100">Escolha o plano ideal para seu cuidado com diabetes</p>
            </div>

            {/* Planos de assinatura */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plano Básico */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Básico</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    Grátis
                  </div>
                  <p className="text-sm text-gray-600">Para sempre</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Registro de glicemia</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Controle de medicamentos</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Lembretes básicos</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Acesso à comunidade</span>
                  </div>
                </div>

                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors">
                  Plano Atual
                </button>
              </div>

              {/* Plano Premium */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Premium</h3>
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    R$ 19,90
                    <span className="text-lg text-gray-500">/mês</span>
                  </div>
                  <p className="text-sm text-gray-600">Ou R$ 199,90/ano (2 meses grátis)</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Tudo do plano Básico</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Relatórios detalhados</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Análise de tendências</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Notificações inteligentes</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Backup na nuvem</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Suporte prioritário</span>
                  </div>
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Assinar Premium
                </button>
              </div>

              {/* Plano Profissional */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Profissional</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    R$ 39,90
                    <span className="text-lg text-gray-500">/mês</span>
                  </div>
                  <p className="text-sm text-gray-600">Para profissionais de saúde</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Tudo do plano Premium</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Gestão de múltiplos pacientes</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Dashboard médico</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Relatórios para consultas</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">API para integração</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">Suporte 24/7</span>
                  </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Assinar Profissional
                </button>
              </div>
            </div>

            {/* Benefícios adicionais */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Por que escolher o DiabetCare Premium?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Monitoramento Avançado</h4>
                  <p className="text-sm text-gray-600">
                    Análises detalhadas dos seus dados de glicemia com insights personalizados
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Relatórios Inteligentes</h4>
                  <p className="text-sm text-gray-600">
                    Relatórios automáticos para compartilhar com seu médico
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Bell className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Alertas Personalizados</h4>
                  <p className="text-sm text-gray-600">
                    Notificações inteligentes baseadas nos seus padrões únicos
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Star className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Suporte Especializado</h4>
                  <p className="text-sm text-gray-600">
                    Acesso direto a nossa equipe de especialistas em diabetes
                  </p>
                </div>
              </div>
            </div>

            {/* Garantia e segurança */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Garantia de Satisfação
                </h3>
                <p className="text-gray-600 mb-4">
                  Experimente qualquer plano premium por 7 dias grátis. Se não ficar satisfeito, 
                  cancelamos sem perguntas e devolvemos 100% do seu dinheiro.
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <span>🔒 Dados criptografados</span>
                  <span>•</span>
                  <span>💳 Pagamento seguro</span>
                  <span>•</span>
                  <span>📱 Cancele quando quiser</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* App Signature */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">DiabetCare</h3>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              <p className="font-medium">
                Desenvolvido com carinho para a comunidade diabética
              </p>
              
              <div className="flex items-center justify-center space-x-6 text-xs">
                <span>Versão 1.0.0</span>
                <span>•</span>
                <span>2024</span>
                <span>•</span>
                <span>Feito com React & Next.js</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-4">
                <p className="text-xs text-gray-500">
                  Este aplicativo é uma ferramenta de apoio. Sempre consulte seu médico para orientações personalizadas sobre seu tratamento.
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 mt-3">
                <span>💙 Saúde em primeiro lugar</span>
                <span>•</span>
                <span>🤝 Comunidade unida</span>
                <span>•</span>
                <span>📱 Tecnologia a serviço da vida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>© 2024 DiabetCare - Cuidando de você, sempre</p>
        </div>
      </div>
    </div>
  );
}