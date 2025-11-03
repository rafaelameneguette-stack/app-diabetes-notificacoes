"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Activity, Calendar, Pill, Utensils, TrendingUp, Clock, AlertCircle, MessageCircle, Send, Users, Heart, Crown, Check, Star, Award, Trophy, Target, ChefHat, Filter, Timer, Info } from "lucide-react";

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

interface PointsSystem {
  totalPoints: number;
  level: string;
  consecutiveDays: number;
  todayPoints: number;
  levelProgress: number;
}

interface Recipe {
  id: string;
  name: string;
  category: "café da manhã" | "almoço" | "jantar" | "lanche";
  prepTime: number;
  servings: number;
  carbs: number;
  calories: number;
  ingredients: string[];
  instructions: string[];
  diabeticTips: string;
}

export default function DiabetCareApp() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "subscription" | "points" | "recipes">("dashboard");
  const [selectedRecipeCategory, setSelectedRecipeCategory] = useState<"todas" | Recipe["category"]>("todas");
  
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

  const [pointsSystem, setPointsSystem] = useState<PointsSystem>({
    totalPoints: 1250,
    level: "Comprometido",
    consecutiveDays: 12,
    todayPoints: 20,
    levelProgress: 65
  });

  const [recipes] = useState<Recipe[]>([
    {
      id: "1",
      name: "Omelete de Espinafre com Queijo",
      category: "café da manhã",
      prepTime: 15,
      servings: 1,
      carbs: 5,
      calories: 280,
      ingredients: [
        "2 ovos",
        "1 xícara de espinafre fresco",
        "30g de queijo minas light",
        "1 colher de chá de azeite",
        "Sal e pimenta a gosto"
      ],
      instructions: [
        "Aqueça o azeite em uma frigideira antiaderente",
        "Refogue o espinafre até murchar",
        "Bata os ovos e tempere com sal e pimenta",
        "Despeje os ovos na frigideira sobre o espinafre",
        "Adicione o queijo e dobre a omelete ao meio",
        "Sirva imediatamente"
      ],
      diabeticTips: "Rica em proteínas e baixa em carboidratos, ideal para manter a glicemia estável pela manhã."
    },
    {
      id: "2",
      name: "Salmão Grelhado com Legumes",
      category: "almoço",
      prepTime: 25,
      servings: 2,
      carbs: 12,
      calories: 350,
      ingredients: [
        "2 filés de salmão (150g cada)",
        "1 abobrinha média cortada em fatias",
        "1 berinjela pequena em cubos",
        "1 pimentão vermelho em tiras",
        "2 colheres de sopa de azeite",
        "Ervas finas, sal e pimenta"
      ],
      instructions: [
        "Tempere o salmão com sal, pimenta e ervas",
        "Aqueça uma grelha ou frigideira",
        "Grelhe o salmão por 4-5 minutos de cada lado",
        "Em outra panela, refogue os legumes no azeite",
        "Tempere os legumes com sal e pimenta",
        "Sirva o salmão sobre os legumes"
      ],
      diabeticTips: "Ômega-3 do salmão ajuda na sensibilidade à insulina. Legumes fornecem fibras que controlam a absorção de glicose."
    },
    {
      id: "3",
      name: "Frango ao Curry com Couve-flor",
      category: "jantar",
      prepTime: 30,
      servings: 3,
      carbs: 8,
      calories: 290,
      ingredients: [
        "400g de peito de frango em cubos",
        "1 couve-flor média cortada em buquês",
        "1 cebola média picada",
        "2 dentes de alho picados",
        "1 colher de sopa de curry em pó",
        "200ml de leite de coco light",
        "Sal e coentro fresco"
      ],
      instructions: [
        "Tempere o frango com sal e curry",
        "Refogue a cebola e alho até dourar",
        "Adicione o frango e cozinhe até dourar",
        "Acrescente a couve-flor e o leite de coco",
        "Cozinhe em fogo baixo por 15 minutos",
        "Finalize com coentro fresco"
      ],
      diabeticTips: "Couve-flor substitui o arroz tradicional, reduzindo carboidratos. Curry tem propriedades anti-inflamatórias."
    },
    {
      id: "4",
      name: "Mix de Castanhas e Sementes",
      category: "lanche",
      prepTime: 5,
      servings: 1,
      carbs: 6,
      calories: 180,
      ingredients: [
        "10 amêndoas",
        "5 castanhas do Pará",
        "1 colher de sopa de sementes de girassol",
        "1 colher de chá de sementes de chia",
        "Pitada de canela em pó"
      ],
      instructions: [
        "Misture todas as castanhas e sementes",
        "Polvilhe com canela",
        "Consuma como lanche entre as refeições"
      ],
      diabeticTips: "Gorduras boas e fibras que promovem saciedade sem elevar a glicemia. Ideal para lanches."
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

  const markMedicationTaken = (medicationId: string, timeIndex: number) => {
    setMedications(medications.map(med => {
      if (med.id === medicationId) {
        const newTaken = [...med.taken];
        newTaken[timeIndex] = true;
        
        // Adicionar pontos quando marcar medicamento como tomado
        if (!med.taken[timeIndex]) {
          setPointsSystem(prev => ({
            ...prev,
            totalPoints: prev.totalPoints + 10,
            todayPoints: prev.todayPoints + 10
          }));
        }
        
        return { ...med, taken: newTaken };
      }
      return med;
    }));
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

  const getLevelInfo = (level: string) => {
    const levels = {
      "Iniciante": { icon: "🌱", color: "text-green-500", description: "Começando a jornada" },
      "Comprometido": { icon: "💪", color: "text-blue-500", description: "Mantendo a consistência" },
      "Disciplinado": { icon: "🎯", color: "text-purple-500", description: "Foco total no tratamento" },
      "Expert": { icon: "⭐", color: "text-yellow-500", description: "Mestre no autocuidado" },
      "Mestre": { icon: "👑", color: "text-gold-500", description: "Exemplo de dedicação" }
    };
    return levels[level as keyof typeof levels] || levels["Iniciante"];
  };

  const filteredRecipes = selectedRecipeCategory === "todas" 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedRecipeCategory);

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
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 flex items-center justify-center py-4 px-6 font-medium transition-colors whitespace-nowrap ${
                activeTab === "dashboard" 
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Activity className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("points")}
              className={`flex-1 flex items-center justify-center py-4 px-6 font-medium transition-colors whitespace-nowrap ${
                activeTab === "points" 
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Award className="h-5 w-5 mr-2" />
              Pontuação
            </button>
            <button
              onClick={() => setActiveTab("recipes")}
              className={`flex-1 flex items-center justify-center py-4 px-6 font-medium transition-colors whitespace-nowrap ${
                activeTab === "recipes" 
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ChefHat className="h-5 w-5 mr-2" />
              Receitas
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center py-4 px-6 font-medium transition-colors whitespace-nowrap ${
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
              className={`flex-1 flex items-center justify-center py-4 px-6 font-medium transition-colors whitespace-nowrap ${
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
                            <button
                              onClick={() => markMedicationTaken(medication.id, index)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                medication.taken[index] 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                            >
                              {medication.taken[index] && <Check className="h-3 w-3" />}
                            </button>
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

        {/* Points System Content */}
        {activeTab === "points" && (
          <div className="space-y-6">
            {/* Header da Pontuação */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Sistema de Pontuação</h2>
              <p className="text-purple-100">Seja recompensado por cuidar da sua saúde!</p>
            </div>

            {/* Status Atual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pontos Totais */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pontos Totais</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {pointsSystem.totalPoints}
                </div>
                <p className="text-sm text-gray-600">Pontos acumulados</p>
              </div>

              {/* Nível Atual */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className={`bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{getLevelInfo(pointsSystem.level).icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nível Atual</h3>
                <div className={`text-2xl font-bold mb-1 ${getLevelInfo(pointsSystem.level).color}`}>
                  {pointsSystem.level}
                </div>
                <p className="text-sm text-gray-600">{getLevelInfo(pointsSystem.level).description}</p>
              </div>

              {/* Sequência */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sequência</h3>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {pointsSystem.consecutiveDays}
                </div>
                <p className="text-sm text-gray-600">Dias consecutivos</p>
              </div>
            </div>

            {/* Progresso do Nível */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Progresso para o Próximo Nível</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{pointsSystem.level}</span>
                  <span>{pointsSystem.levelProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${pointsSystem.levelProgress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Continue tomando seus medicamentos no horário para avançar de nível!
              </p>
            </div>

            {/* Como Ganhar Pontos */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Como Ganhar Pontos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    <Pill className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Medicamento no Horário</h4>
                    <p className="text-sm text-gray-600">+10 pontos por dose</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Registro de Glicemia</h4>
                    <p className="text-sm text-gray-600">+5 pontos por medição</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Sequência de 7 Dias</h4>
                    <p className="text-sm text-gray-600">+50 pontos bônus</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                  <div className="bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Meta Mensal</h4>
                    <p className="text-sm text-gray-600">+100 pontos bônus</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Níveis e Recompensas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Níveis e Recompensas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">🌱</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">Iniciante</h4>
                      <p className="text-sm text-gray-600">0 - 500 pontos</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Começando a jornada</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">💪</span>
                    <div>
                      <h4 className="font-semibold text-blue-800">Comprometido</h4>
                      <p className="text-sm text-blue-600">501 - 1500 pontos</p>
                    </div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Nível Atual</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">🎯</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">Disciplinado</h4>
                      <p className="text-sm text-gray-600">1501 - 3000 pontos</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Foco total no tratamento</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">⭐</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">Expert</h4>
                      <p className="text-sm text-gray-600">3001 - 5000 pontos</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Mestre no autocuidado</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">👑</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">Mestre</h4>
                      <p className="text-sm text-gray-600">5000+ pontos</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Exemplo de dedicação</div>
                </div>
              </div>
            </div>

            {/* Estatísticas de Hoje */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Pontos de Hoje</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    +{pointsSystem.todayPoints}
                  </div>
                  <p className="text-sm text-gray-600">Pontos ganhos hoje</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Continue assim!</p>
                  <p className="text-xs text-gray-500">
                    Você está no caminho certo para o próximo nível
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recipes Content */}
        {activeTab === "recipes" && (
          <div className="space-y-6">
            {/* Header das Receitas */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-lg p-8 text-white text-center">
              <ChefHat className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Receitas Saudáveis</h2>
              <p className="text-green-100">Deliciosas opções para diabéticos</p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Filtrar por Categoria</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedRecipeCategory("todas")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedRecipeCategory === "todas"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setSelectedRecipeCategory("café da manhã")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedRecipeCategory === "café da manhã"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Café da Manhã
                </button>
                <button
                  onClick={() => setSelectedRecipeCategory("almoço")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedRecipeCategory === "almoço"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Almoço
                </button>
                <button
                  onClick={() => setSelectedRecipeCategory("jantar")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedRecipeCategory === "jantar"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Jantar
                </button>
                <button
                  onClick={() => setSelectedRecipeCategory("lanche")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedRecipeCategory === "lanche"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Lanche
                </button>
              </div>
            </div>

            {/* Lista de Receitas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Header da Receita */}
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{recipe.name}</h3>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
                        {recipe.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-1" />
                        {recipe.prepTime} min
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {recipe.servings} porção{recipe.servings > 1 ? 'ões' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Informações Nutricionais */}
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Informações Nutricionais (por porção)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{recipe.carbs}g</div>
                        <div className="text-sm text-blue-700">Carboidratos</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">{recipe.calories}</div>
                        <div className="text-sm text-orange-700">Calorias</div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredientes */}
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Ingredientes</h4>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Modo de Preparo */}
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Modo de Preparo</h4>
                    <ol className="space-y-2">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex text-sm text-gray-600">
                          <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Dica para Diabéticos */}
                  <div className="p-6 bg-green-50">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">Dica para Diabéticos</h4>
                        <p className="text-sm text-green-700">{recipe.diabeticTips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dicas Gerais */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Dicas Importantes para Diabéticos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🥗 Controle de Porções</h4>
                  <p className="text-sm text-blue-700">
                    Use o método do prato: 1/2 vegetais, 1/4 proteína magra, 1/4 carboidratos complexos.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🌾 Fibras são Aliadas</h4>
                  <p className="text-sm text-green-700">
                    Alimentos ricos em fibras ajudam a controlar a glicemia e promovem saciedade.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">⏰ Horários Regulares</h4>
                  <p className="text-sm text-purple-700">
                    Mantenha horários regulares para as refeições para melhor controle glicêmico.
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">💧 Hidratação</h4>
                  <p className="text-sm text-orange-700">
                    Beba bastante água e evite bebidas açucaradas para manter a glicemia estável.
                  </p>
                </div>
              </div>
            </div>
          </div>
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