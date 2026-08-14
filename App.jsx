import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  Home, Wallet, Target, CalendarDays, Bell, Bot, Plus, Smartphone, ShieldCheck,
  Cloud, TrendingUp, LogIn, User, Lock, Mail, Trash2, Pencil, Filter, Eye,
  EyeOff, Moon, Sun, UserPlus, Building2, Gauge, AlertTriangle, Download,
  Upload, Wifi, WifiOff, Database, Settings, Sparkles, CreditCard, Repeat,
  Search, Save, BadgeDollarSign, PiggyBank, SplitSquareHorizontal,
  FileSpreadsheet, Rocket, PackageCheck, Fingerprint, CheckCircle2
} from 'lucide-react';

const APP_VERSION = '6.0';
const STORAGE_KEY = 'meu-gps-financeiro-6-0';

const dadosIniciais = {
  usuario: {
    nome: 'Daiane',
    email: 'daiane@email.com',
    senha: '123456',
    plano: 'Premium Demo',
    pinAtivo: true,
    biometriaAtiva: false
  },
  preferencias: {
    temaEscuro: true,
    notificacoes: false,
    sincronizacao: 'Local',
    instalacaoPWA: 'Pendente'
  },
  contasUsuario: [
    { id: 1, nome: 'Conta principal', tipo: 'Conta corrente', instituicao: 'Banco principal', saldo: 6450, cor: 'from-cyan-500 to-blue-700' },
    { id: 2, nome: 'Cartão crédito', tipo: 'Cartão', instituicao: 'Nubank', saldo: -1850, cor: 'from-rose-500 to-pink-700' },
    { id: 3, nome: 'Investimentos', tipo: 'Investimento', instituicao: 'Corretora', saldo: 12880, cor: 'from-emerald-500 to-teal-700' }
  ],
  cartoes: [
    { id: 1, nome: 'Nubank Gold', banco: 'Nubank', limite: 6000, utilizado: 1850, fechamento: 5, vencimento: 10, cor: 'from-rose-500 to-purple-700' },
    { id: 2, nome: 'Banco Principal', banco: 'Banco principal', limite: 3500, utilizado: 920, fechamento: 12, vencimento: 18, cor: 'from-cyan-500 to-blue-800' }
  ],
  transacoes: [
    { id: 1, tipo: 'Receita', descricao: 'Salário', categoria: 'Renda fixa', valor: 9800, data: '2026-08-05', conta: 'Conta principal', recorrente: true, meio: 'PIX recebido' },
    { id: 2, tipo: 'Receita', descricao: 'Renda extra', categoria: 'Extra', valor: 3000, data: '2026-08-06', conta: 'Conta principal', recorrente: false, meio: 'Transferência' },
    { id: 3, tipo: 'Despesa', descricao: 'Mercado', categoria: 'Alimentação', valor: 980, data: '2026-08-04', conta: 'Conta principal', recorrente: false, meio: 'Débito' },
    { id: 4, tipo: 'Despesa', descricao: 'Cartão Nubank', categoria: 'Cartão', valor: 1850, data: '2026-08-10', conta: 'Cartão crédito', recorrente: true, meio: 'Cartão' },
    { id: 5, tipo: 'Despesa', descricao: 'Condomínio', categoria: 'Moradia', valor: 760, data: '2026-08-12', conta: 'Conta principal', recorrente: true, meio: 'Boleto' },
    { id: 6, tipo: 'Despesa', descricao: 'Transporte', categoria: 'Mobilidade', valor: 760, data: '2026-08-15', conta: 'Conta principal', recorrente: false, meio: 'PIX enviado' },
    { id: 7, tipo: 'Despesa', descricao: 'Streaming', categoria: 'Lazer', valor: 89, data: '2026-08-18', conta: 'Cartão crédito', recorrente: true, meio: 'Cartão' },
    { id: 8, tipo: 'Despesa', descricao: 'Farmácia', categoria: 'Saúde', valor: 230, data: '2026-08-19', conta: 'Conta principal', recorrente: false, meio: 'Débito' }
  ],
  parcelamentos: [
    { id: 1, descricao: 'Notebook', categoria: 'Tecnologia', valorTotal: 4200, parcelas: 12, parcelaAtual: 3, valorParcela: 350, cartao: 'Nubank Gold' }
  ],
  investimentos: [
    { id: 1, nome: 'Reserva CDB', tipo: 'CDB', aplicado: 6800, rendimento: 420 },
    { id: 2, nome: 'Tesouro Selic', tipo: 'Tesouro', aplicado: 3500, rendimento: 180 },
    { id: 3, nome: 'Fundo índice', tipo: 'Fundo', aplicado: 2580, rendimento: 260 }
  ],
  orcamentos: [
    { id: 1, categoria: 'Alimentação', limite: 1200 },
    { id: 2, categoria: 'Cartão', limite: 1800 },
    { id: 3, categoria: 'Moradia', limite: 900 },
    { id: 4, categoria: 'Mobilidade', limite: 700 },
    { id: 5, categoria: 'Lazer', limite: 300 },
    { id: 6, categoria: 'Saúde', limite: 400 }
  ],
  metas: [
    { id: 1, nome: 'Reserva de Emergência', atual: 6800, alvo: 11000, cor: 'bg-emerald-500', prioridade: 'Alta' },
    { id: 2, nome: 'Viagem', atual: 4200, alvo: 5200, cor: 'bg-cyan-500', prioridade: 'Média' },
    { id: 3, nome: 'Novo projeto pessoal', atual: 1900, alvo: 6000, cor: 'bg-amber-500', prioridade: 'Média' }
  ],
  ultimoBackup: 'Ainda não realizado'
};

function carregarDados() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? { ...dadosIniciais, ...JSON.parse(salvo) } : dadosIniciais;
  } catch {
    return dadosIniciais;
  }
}

export default function App() {
  const [estado, setEstado] = useState(dadosIniciais);
  const [logado, setLogado] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [aba, setAba] = useState('dashboard');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState('Como posso economizar este mês?');
  const [sincronizando, setSincronizando] = useState(false);
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const { usuario, preferencias, contasUsuario, cartoes, transacoes, parcelamentos, investimentos, orcamentos, metas, ultimoBackup } = estado;
  const temaEscuro = preferencias.temaEscuro;

  const [novaConta, setNovaConta] = useState({ nome: '', tipo: 'Conta corrente', saldo: '', instituicao: '' });
  const [novoCartao, setNovoCartao] = useState({ nome: '', banco: '', limite: '', utilizado: '', fechamento: '5', vencimento: '10' });
  const [novoOrcamento, setNovoOrcamento] = useState({ categoria: '', limite: '' });
  const [novaMeta, setNovaMeta] = useState({ nome: '', atual: '', alvo: '', prioridade: 'Média' });
  const [novoInvestimento, setNovoInvestimento] = useState({ nome: '', tipo: 'CDB', aplicado: '', rendimento: '' });
  const [novoParcelamento, setNovoParcelamento] = useState({ descricao: '', categoria: '', valorTotal: '', parcelas: '', cartao: 'Nubank Gold' });
  const [nova, setNova] = useState({ tipo: 'Despesa', descricao: '', categoria: '', valor: '', data: '2026-08-20', conta: 'Conta principal', recorrente: false, meio: 'PIX enviado' });

  const setCampo = (campo, valor) => setEstado(atual => ({ ...atual, [campo]: valor }));
  const setPreferencia = (campo, valor) => setEstado(atual => ({ ...atual, preferencias: { ...atual.preferencias, [campo]: valor } }));
  const setUsuarioCampo = (campo, valor) => setEstado(atual => ({ ...atual, usuario: { ...atual.usuario, [campo]: valor } }));

  const base = temaEscuro ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-950';
  const painel = temaEscuro ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const painel2 = temaEscuro ? 'bg-slate-800' : 'bg-slate-100';
  const textoSuave = temaEscuro ? 'text-slate-400' : 'text-slate-600';
  const input = temaEscuro ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-950';

  useEffect(() => setEstado(carregarDados()), []);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)), [estado]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    const install = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPreferencia('instalacaoPWA', 'Disponível');
    };
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    window.addEventListener('beforeinstallprompt', install);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
      window.removeEventListener('beforeinstallprompt', install);
    };
  }, []);

  const dinheiro = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const receitas = transacoes.filter(t => t.tipo === 'Receita').reduce((s, t) => s + Number(t.valor), 0);
  const despesas = transacoes.filter(t => t.tipo === 'Despesa').reduce((s, t) => s + Number(t.valor), 0);
  const saldo = receitas - despesas;
  const patrimonio = contasUsuario.reduce((s, c) => s + Number(c.saldo), 0) + investimentos.reduce((s, i) => s + Number(i.aplicado) + Number(i.rendimento), 0);
  const totalInvestido = investimentos.reduce((s, i) => s + Number(i.aplicado) + Number(i.rendimento), 0);
  const usoCartao = cartoes.reduce((s, c) => s + Number(c.utilizado), 0);
  const limiteCartao = cartoes.reduce((s, c) => s + Number(c.limite), 0);
  const economiaMensal = receitas > 0 ? Math.round((saldo / receitas) * 100) : 0;
  const categoriasUnicas = ['Todas', ...Array.from(new Set(transacoes.map(t => t.categoria)))];
  const cores = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b', '#22c55e', '#ec4899'];

  const transacoesFiltradas = transacoes.filter(t => {
    const porCategoria = filtroCategoria === 'Todas' || t.categoria === filtroCategoria;
    const porTipo = filtroTipo === 'Todos' || t.tipo === filtroTipo;
    const porBusca = !busca || `${t.descricao} ${t.categoria} ${t.conta} ${t.meio}`.toLowerCase().includes(busca.toLowerCase());
    return porCategoria && porTipo && porBusca;
  });

  const categorias = useMemo(() => {
    const mapa = {};
    transacoes.filter(t => t.tipo === 'Despesa').forEach(t => {
      mapa[t.categoria] = (mapa[t.categoria] || 0) + Number(t.valor);
    });
    return Object.entries(mapa).map(([name, value]) => ({ name, value }));
  }, [transacoes]);

  const usoOrcamentos = useMemo(() => orcamentos.map(o => {
    const gasto = transacoes.filter(t => t.tipo === 'Despesa' && t.categoria === o.categoria).reduce((s, t) => s + Number(t.valor), 0);
    const percentual = Math.round((gasto / Math.max(1, Number(o.limite))) * 100);
    const restante = Number(o.limite) - gasto;
    const status = percentual >= 100 ? 'Estourado' : percentual >= 85 ? 'Atenção' : 'Dentro do limite';
    return { ...o, gasto, percentual, restante, status };
  }), [orcamentos, transacoes]);

  const maiorCategoria = categorias.length ? categorias.reduce((a, b) => a.value > b.value ? a : b) : { name: 'Sem dados', value: 0 };
  const orcamentosEstourados = usoOrcamentos.filter(o => o.percentual >= 100);
  const orcamentosAtencao = usoOrcamentos.filter(o => o.percentual >= 85 && o.percentual < 100);
  const gastosFixos = transacoes.filter(t => t.tipo === 'Despesa' && t.recorrente).reduce((s, t) => s + Number(t.valor), 0);
  const saudeFinanceira = Math.max(0, Math.min(100, 100 - Math.round((despesas / Math.max(1, receitas)) * 70) - (orcamentosEstourados.length * 8) - ((usoCartao / Math.max(1, limiteCartao)) > 0.7 ? 8 : 0)));

  const dadosLinha = [
    { mes: 'Mar', saldo: 4200, despesas: 3900, receitas: 8100, patrimonio: 16200 },
    { mes: 'Abr', saldo: 5100, despesas: 4100, receitas: 9200, patrimonio: 17800 },
    { mes: 'Mai', saldo: 6200, despesas: 3800, receitas: 10000, patrimonio: 19100 },
    { mes: 'Jun', saldo: 7100, despesas: 4300, receitas: 11400, patrimonio: 21500 },
    { mes: 'Jul', saldo: 7650, despesas: 4550, receitas: 12200, patrimonio: 23900 },
    { mes: 'Ago', saldo, despesas, receitas, patrimonio }
  ];

  const alertas = [
    { titulo: 'Versão 6.0 pronta para publicação', detalhe: 'Estrutura com PWA, cartões, investimentos, parcelas, CSV e instalação iPhone.', nivel: 'Sistema' },
    { titulo: 'Cartão vence em breve', detalhe: `${dinheiro(usoCartao)} previsto no ciclo atual`, nivel: 'Atenção' },
    { titulo: 'Backup local ativo', detalhe: 'Dados salvos no navegador até conectar Firebase.', nivel: 'Sistema' },
    ...orcamentosEstourados.map(o => ({ titulo: `Limite estourado: ${o.categoria}`, detalhe: `${o.percentual}% usado`, nivel: 'Urgente' })),
    ...orcamentosAtencao.map(o => ({ titulo: `Perto do limite: ${o.categoria}`, detalhe: `${o.percentual}% usado`, nivel: 'Atenção' }))
  ];

  const respostaIA = mensagem.toLowerCase().includes('economizar')
    ? `Sugestão: o maior gasto está em ${maiorCategoria.name}. Os gastos fixos somam ${dinheiro(gastosFixos)}. Reduza 10% dessa categoria e direcione para a meta de maior prioridade.`
    : mensagem.toLowerCase().includes('cart')
      ? `Você usou ${Math.round((usoCartao / Math.max(1, limiteCartao)) * 100)}% do limite total dos cartões. O ideal é manter abaixo de 40%.`
      : mensagem.toLowerCase().includes('meta')
        ? `Seu saldo livre é ${dinheiro(saldo)}. Se guardar 30% dele, você adiciona ${dinheiro(saldo * 0.3)} às metas este mês.`
        : 'Posso analisar saldo, cartões, PIX, parcelas, investimentos, metas, orçamentos e saúde financeira com base nos dados do app.';

  const menu = [
    { id: 'dashboard', nome: 'Dashboard', icon: Home },
    { id: 'resumo', nome: 'Saúde', icon: Sparkles },
    { id: 'cartoes', nome: 'Cartões', icon: CreditCard },
    { id: 'contas', nome: 'Contas', icon: Building2 },
    { id: 'transacoes', nome: 'Transações', icon: Wallet },
    { id: 'parcelas', nome: 'Parcelas', icon: SplitSquareHorizontal },
    { id: 'orcamentos', nome: 'Orçamentos', icon: Gauge },
    { id: 'metas', nome: 'Metas', icon: Target },
    { id: 'investimentos', nome: 'Investimentos', icon: PiggyBank },
    { id: 'calendario', nome: 'Calendário', icon: CalendarDays },
    { id: 'ia', nome: 'IA Financeira', icon: Bot },
    { id: 'sync', nome: 'Nuvem', icon: Cloud },
    { id: 'publicar', nome: 'Publicar', icon: Smartphone }
  ];

  function entrar() {
    if (usuario.email && usuario.senha) setLogado(true);
  }

  function criarConta() {
    if (!usuario.nome || !usuario.email || !usuario.senha) return;
    setModoCadastro(false);
    setLogado(true);
  }

  function entrarSocial(tipo) {
    setCampo('usuario', {
      ...usuario,
      nome: tipo === 'Google' ? 'Usuária Google' : 'Usuária Microsoft',
      email: tipo === 'Google' ? 'conta.google@email.com' : 'conta.microsoft@email.com'
    });
    setLogado(true);
  }

  function simularSync() {
    setSincronizando(true);
    setTimeout(() => {
      setSincronizando(false);
      setPreferencia('sincronizacao', 'Firebase pronto');
      setCampo('ultimoBackup', new Date().toLocaleString('pt-BR'));
    }, 900);
  }

  async function instalarPWA() {
    if (!deferredPrompt) {
      setPreferencia('instalacaoPWA', 'No iPhone: Safari > Compartilhar > Adicionar à Tela de Início');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setPreferencia('instalacaoPWA', 'Instalação solicitada');
  }

  function adicionarContaFinanceira() {
    if (!novaConta.nome || !novaConta.saldo) return;
    const coresConta = ['from-cyan-500 to-blue-700', 'from-emerald-500 to-teal-700', 'from-violet-500 to-purple-700', 'from-amber-500 to-orange-700'];
    setCampo('contasUsuario', [...contasUsuario, {
      id: Date.now(),
      nome: novaConta.nome,
      tipo: novaConta.tipo,
      saldo: Number(novaConta.saldo),
      instituicao: novaConta.instituicao || 'Instituição',
      cor: coresConta[contasUsuario.length % coresConta.length]
    }]);
    setNovaConta({ nome: '', tipo: 'Conta corrente', saldo: '', instituicao: '' });
  }

  function adicionarCartao() {
    if (!novoCartao.nome || !novoCartao.limite) return;
    const coresCartao = ['from-rose-500 to-purple-700', 'from-cyan-500 to-blue-800', 'from-amber-500 to-orange-700', 'from-emerald-500 to-teal-700'];
    setCampo('cartoes', [...cartoes, {
      id: Date.now(),
      nome: novoCartao.nome,
      banco: novoCartao.banco || 'Banco',
      limite: Number(novoCartao.limite),
      utilizado: Number(novoCartao.utilizado || 0),
      fechamento: Number(novoCartao.fechamento),
      vencimento: Number(novoCartao.vencimento),
      cor: coresCartao[cartoes.length % coresCartao.length]
    }]);
    setNovoCartao({ nome: '', banco: '', limite: '', utilizado: '', fechamento: '5', vencimento: '10' });
  }

  function adicionarOrcamento() {
    if (!novoOrcamento.categoria || !novoOrcamento.limite) return;
    const existe = orcamentos.find(o => o.categoria.toLowerCase() === novoOrcamento.categoria.toLowerCase());
    if (existe) {
      setCampo('orcamentos', orcamentos.map(o => o.id === existe.id ? { ...o, limite: Number(novoOrcamento.limite) } : o));
    } else {
      setCampo('orcamentos', [...orcamentos, { id: Date.now(), categoria: novoOrcamento.categoria, limite: Number(novoOrcamento.limite) }]);
    }
    setNovoOrcamento({ categoria: '', limite: '' });
  }

  function adicionarMeta() {
    if (!novaMeta.nome || !novaMeta.alvo) return;
    const coresMeta = ['bg-emerald-500', 'bg-cyan-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500'];
    setCampo('metas', [...metas, {
      id: Date.now(),
      nome: novaMeta.nome,
      atual: Number(novaMeta.atual || 0),
      alvo: Number(novaMeta.alvo),
      prioridade: novaMeta.prioridade,
      cor: coresMeta[metas.length % coresMeta.length]
    }]);
    setNovaMeta({ nome: '', atual: '', alvo: '', prioridade: 'Média' });
  }

  function adicionarInvestimento() {
    if (!novoInvestimento.nome || !novoInvestimento.aplicado) return;
    setCampo('investimentos', [...investimentos, {
      id: Date.now(),
      nome: novoInvestimento.nome,
      tipo: novoInvestimento.tipo,
      aplicado: Number(novoInvestimento.aplicado),
      rendimento: Number(novoInvestimento.rendimento || 0)
    }]);
    setNovoInvestimento({ nome: '', tipo: 'CDB', aplicado: '', rendimento: '' });
  }

  function adicionarParcelamento() {
    if (!novoParcelamento.descricao || !novoParcelamento.valorTotal || !novoParcelamento.parcelas) return;
    const total = Number(novoParcelamento.valorTotal);
    const qtd = Number(novoParcelamento.parcelas);
    setCampo('parcelamentos', [...parcelamentos, {
      id: Date.now(),
      descricao: novoParcelamento.descricao,
      categoria: novoParcelamento.categoria || 'Parcelado',
      valorTotal: total,
      parcelas: qtd,
      parcelaAtual: 1,
      valorParcela: total / Math.max(1, qtd),
      cartao: novoParcelamento.cartao
    }]);
    setNovoParcelamento({ descricao: '', categoria: '', valorTotal: '', parcelas: '', cartao: cartoes[0]?.nome || 'Cartão' });
  }

  function adicionarOuAtualizarTransacao() {
    if (!nova.descricao || !nova.categoria || !nova.valor) return;
    if (editandoId) {
      setCampo('transacoes', transacoes.map(t => t.id === editandoId ? { ...t, ...nova, valor: Number(nova.valor) } : t));
      setEditandoId(null);
    } else {
      setCampo('transacoes', [...transacoes, { id: Date.now(), ...nova, valor: Number(nova.valor) }]);
    }
    setNova({ tipo: 'Despesa', descricao: '', categoria: '', valor: '', data: '2026-08-20', conta: contasUsuario[0]?.nome || 'Conta principal', recorrente: false, meio: 'PIX enviado' });
  }

  function editarTransacao(t) {
    setNova({ ...t, valor: String(t.valor) });
    setEditandoId(t.id);
    setAba('transacoes');
  }

  function baixarArquivo(blob, nome) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportarDados() {
    baixarArquivo(new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' }), 'backup-meu-gps-financeiro-6-0.json');
    setCampo('ultimoBackup', new Date().toLocaleString('pt-BR'));
  }

  function exportarCSV() {
    const linhas = [
      'tipo;descricao;categoria;valor;data;conta;meio;recorrente',
      ...transacoes.map(t => `${t.tipo};${t.descricao};${t.categoria};${t.valor};${t.data};${t.conta};${t.meio};${t.recorrente ? 'Sim' : 'Não'}`)
    ];
    baixarArquivo(new Blob([linhas.join('\n')], { type: 'text/csv;charset=utf-8' }), 'transacoes-meu-gps-financeiro-6-0.csv');
  }

  function importarDados(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setEstado({ ...dadosIniciais, ...JSON.parse(reader.result), ultimoBackup: new Date().toLocaleString('pt-BR') });
      } catch {
        alert('Arquivo inválido. Use um backup JSON do Meu GPS Financeiro.');
      }
    };
    reader.readAsText(arquivo);
  }

  if (!logado) {
    return <LoginScreen {...{ base, painel, painel2, input, textoSuave, temaEscuro, setPreferencia, usuario, setUsuarioCampo, modoCadastro, setModoCadastro, mostrarSenha, setMostrarSenha, entrar, criarConta, entrarSocial }} />;
  }

  return (
    <div className={`min-h-screen ${base} transition-colors`}>
      <div className="flex min-h-screen">
        <aside className={`hidden lg:flex w-72 ${temaEscuro ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border-r p-5 flex-col gap-5`}>
          <div className="rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-950 p-5 shadow-xl text-white">
            <p className="text-sm text-cyan-100">Versão {APP_VERSION}</p>
            <h1 className="text-2xl font-black mt-1">Meu GPS Financeiro</h1>
            <p className="text-xs text-cyan-100 mt-2">PWA profissional para iPhone.</p>
          </div>
          <div className={`rounded-3xl ${painel2} p-4 flex items-center gap-3`}>
            <div className="h-11 w-11 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center"><User size={20}/></div>
            <div><p className="font-bold">{usuario.nome}</p><p className={`text-xs ${textoSuave}`}>{usuario.plano}</p></div>
          </div>
          <div className={`rounded-2xl ${painel2} p-3 flex items-center justify-between text-sm`}>
            <span className="flex items-center gap-2">{online ? <Wifi size={16} className="text-emerald-400"/> : <WifiOff size={16} className="text-rose-400"/>}{online ? 'Online' : 'Offline'}</span>
            <span className={preferencias.sincronizacao.includes('Firebase') ? 'text-emerald-400' : 'text-amber-400'}>{preferencias.sincronizacao}</span>
          </div>
          <button onClick={() => setPreferencia('temaEscuro', !temaEscuro)} className={`rounded-2xl ${painel2} p-3 flex items-center justify-center gap-2 font-semibold`}>{temaEscuro ? <Sun size={18}/> : <Moon size={18}/>} {temaEscuro ? 'Tema claro' : 'Tema escuro'}</button>
          <nav className="space-y-2 overflow-y-auto pr-1">
            {menu.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => setAba(item.id)} className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${aba === item.id ? 'bg-cyan-500 text-slate-950 font-bold' : `${textoSuave} hover:opacity-80`}`}><Icon size={20} /> {item.nome}</button>; })}
          </nav>
          <button onClick={() => setLogado(false)} className={`mt-auto rounded-2xl ${painel2} p-3 ${textoSuave}`}>Sair da conta</button>
        </aside>

        <main className="flex-1 p-4 md:p-8 space-y-6">
          <header className="rounded-3xl bg-gradient-to-r from-cyan-700 via-blue-900 to-slate-950 p-6 md:p-8 shadow-2xl text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-cyan-100 font-semibold">Migração aplicada: versão {APP_VERSION}</p>
                <h2 className="text-3xl md:text-5xl font-black mt-2">Olá, {usuario.nome}. Seu app está pronto para virar PWA profissional.</h2>
                <p className="text-cyan-100 mt-3 max-w-2xl">Dashboard, cartões, parcelas, investimentos, backup, CSV, instalação no iPhone e estrutura preparada para Firebase.</p>
              </div>
              <div className="grid grid-cols-5 gap-2 lg:hidden">
                {menu.slice(0, 9).map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => setAba(item.id)} className={`rounded-2xl p-3 ${aba === item.id ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900/50'}`}><Icon size={18} className="mx-auto"/></button>; })}
                <button onClick={() => setPreferencia('temaEscuro', !temaEscuro)} className="rounded-2xl p-3 bg-slate-900/50">{temaEscuro ? <Sun size={18} className="mx-auto"/> : <Moon size={18} className="mx-auto"/>}</button>
              </div>
            </div>
          </header>

          {aba === 'dashboard' && <Dashboard {...{ painel, textoSuave, temaEscuro, dinheiro, saldo, patrimonio, despesas, saudeFinanceira, totalInvestido, dadosLinha, categorias, cores, contasUsuario }} />}
          {aba === 'resumo' && <Resumo {...{ painel, painel2, textoSuave, dinheiro, economiaMensal, usoCartao, limiteCartao, investimentos, saldo, maiorCategoria, orcamentosEstourados, orcamentosAtencao, parcelamentos, saudeFinanceira }} />}
          {aba === 'cartoes' && <Cartoes {...{ painel, input, dinheiro, cartoes, novoCartao, setNovoCartao, adicionarCartao, setCampo }} />}
          {aba === 'contas' && <Contas {...{ painel, input, dinheiro, contasUsuario, novaConta, setNovaConta, adicionarContaFinanceira, setCampo }} />}
          {aba === 'transacoes' && <Transacoes {...{ painel, painel2, input, textoSuave, dinheiro, contasUsuario, nova, setNova, editandoId, setEditandoId, adicionarOuAtualizarTransacao, transacoesFiltradas, editarTransacao, setCampo, transacoes, busca, setBusca, filtroTipo, setFiltroTipo, filtroCategoria, setFiltroCategoria, categoriasUnicas }} />}
          {aba === 'parcelas' && <Parcelas {...{ painel, painel2, input, textoSuave, dinheiro, parcelamentos, novoParcelamento, setNovoParcelamento, cartoes, adicionarParcelamento, setCampo }} />}
          {aba === 'orcamentos' && <Orcamentos {...{ painel, input, textoSuave, dinheiro, usoOrcamentos, orcamentos, novoOrcamento, setNovoOrcamento, adicionarOrcamento, setCampo, temaEscuro }} />}
          {aba === 'metas' && <Metas {...{ painel, painel2, input, textoSuave, dinheiro, metas, novaMeta, setNovaMeta, adicionarMeta, setCampo, saldo }} />}
          {aba === 'investimentos' && <Investimentos {...{ painel, input, textoSuave, dinheiro, investimentos, novoInvestimento, setNovoInvestimento, adicionarInvestimento, setCampo }} />}
          {aba === 'calendario' && <Calendario {...{ painel, painel2, textoSuave, dinheiro, transacoes, alertas }} />}
          {aba === 'ia' && <IA {...{ painel, painel2, input, textoSuave, mensagem, setMensagem, respostaIA, despesas, receitas, maiorCategoria, gastosFixos, dinheiro }} />}
          {aba === 'sync' && <Sync {...{ painel, painel2, textoSuave, usuario, preferencias, setUsuarioCampo, setPreferencia, simularSync, sincronizando, ultimoBackup, exportarDados, exportarCSV, importarDados }} />}
          {aba === 'publicar' && <Publicar {...{ painel, painel2, textoSuave, preferencias, instalarPWA }} />}
        </main>
      </div>
    </div>
  );
}

function LoginScreen({ base, painel, painel2, input, textoSuave, temaEscuro, setPreferencia, usuario, setUsuarioCampo, modoCadastro, setModoCadastro, mostrarSenha, setMostrarSenha, entrar, criarConta, entrarSocial }) {
  return (
    <div className={`min-h-screen ${base} flex items-center justify-center p-6 transition-colors`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0891b240,transparent_35%),radial-gradient(circle_at_bottom_right,#1d4ed840,transparent_35%)]"></div>
      <button onClick={() => setPreferencia('temaEscuro', !temaEscuro)} className={`absolute top-5 right-5 rounded-2xl p-3 border ${painel}`}>{temaEscuro ? <Sun size={20}/> : <Moon size={20}/>}</button>
      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-6 items-center">
        <div className="rounded-[2rem] bg-gradient-to-br from-cyan-600 via-blue-800 to-slate-950 p-8 md:p-10 shadow-2xl border border-cyan-400/20 text-white">
          <p className="text-cyan-100 font-semibold">Meu GPS Financeiro 6.0</p>
          <h1 className="text-4xl md:text-6xl font-black mt-3 leading-tight">App financeiro profissional para publicar e instalar no iPhone</h1>
          <p className="text-cyan-100 mt-5 text-lg">PWA, login demonstrativo, estrutura para Firebase, cartões, parcelas, investimentos, backup e CSV.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <FeatureMini icon={<Rocket/>} texto="Vercel"/>
            <FeatureMini icon={<Smartphone/>} texto="iPhone"/>
            <FeatureMini icon={<Cloud/>} texto="Nuvem"/>
            <FeatureMini icon={<Fingerprint/>} texto="Segurança"/>
          </div>
        </div>
        <div className={`rounded-[2rem] ${painel} p-7 md:p-8 border shadow-2xl`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center">{modoCadastro ? <UserPlus/> : <LogIn/>}</div>
            <div><h2 className="text-2xl font-black">{modoCadastro ? 'Cadastrar conta' : 'Acessar conta'}</h2><p className={`${textoSuave} text-sm`}>Login real entra na etapa Firebase</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button onClick={() => entrarSocial('Google')} className={`rounded-2xl ${painel2} p-3 font-bold border border-transparent hover:border-cyan-400`}>Google</button>
            <button onClick={() => entrarSocial('Microsoft')} className={`rounded-2xl ${painel2} p-3 font-bold border border-transparent hover:border-cyan-400`}>Microsoft</button>
          </div>
          <div className="space-y-4">
            {modoCadastro && <Campo label="Nome" icon={<User size={18}/>} value={usuario.nome} onChange={v => setUsuarioCampo('nome', v)} placeholder="Seu nome" input={input}/>} 
            <Campo label="E-mail" icon={<Mail size={18}/>} value={usuario.email} onChange={v => setUsuarioCampo('email', v)} placeholder="seu@email.com" input={input}/>
            <label className="block"><span className={`text-sm ${textoSuave}`}>Senha</span><div className={`mt-2 flex items-center gap-3 rounded-2xl p-3 border ${input}`}><Lock size={18} className="text-cyan-500"/><input type={mostrarSenha ? 'text' : 'password'} value={usuario.senha} onChange={e => setUsuarioCampo('senha', e.target.value)} className="bg-transparent outline-none w-full" placeholder="Digite a senha"/><button onClick={() => setMostrarSenha(!mostrarSenha)}>{mostrarSenha ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>
            <button onClick={modoCadastro ? criarConta : entrar} className="w-full rounded-2xl bg-cyan-400 text-slate-950 font-black p-4 hover:bg-cyan-300 transition">{modoCadastro ? 'Criar conta e entrar' : 'Entrar no app'}</button>
            <button onClick={() => setModoCadastro(!modoCadastro)} className={`w-full rounded-2xl ${painel2} p-3 font-semibold`}>{modoCadastro ? 'Já tenho conta' : 'Criar nova conta'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ painel, textoSuave, temaEscuro, dinheiro, saldo, patrimonio, despesas, saudeFinanceira, totalInvestido, dadosLinha, categorias, cores, contasUsuario }) {
  return <section className="space-y-6"><div className="grid md:grid-cols-5 gap-4">{[{t:'Saldo mensal',v:saldo,c:'text-emerald-400',i:<BadgeDollarSign/>},{t:'Patrimônio',v:patrimonio,c:'text-cyan-400',i:<Building2/>},{t:'Despesas',v:despesas,c:'text-rose-400',i:<CreditCard/>},{t:'Saúde financeira',v:saudeFinanceira + '/100',c:'text-amber-400',i:<Sparkles/>},{t:'Investido',v:totalInvestido,c:'text-emerald-400',i:<PiggyBank/>}].map(card => <CardKPI key={card.t} card={card} dinheiro={dinheiro} painel={painel} textoSuave={textoSuave}/>)}</div><div className="grid xl:grid-cols-3 gap-6"><div className={`xl:col-span-2 rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4">Evolução financeira e patrimônio</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dadosLinha}><CartesianGrid strokeDasharray="3 3" stroke={temaEscuro ? '#1e293b' : '#e2e8f0'}/><XAxis dataKey="mes" stroke="#94a3b8"/><YAxis stroke="#94a3b8"/><Tooltip/><Area type="monotone" dataKey="patrimonio" stroke="#10b981" fill="#10b98122" strokeWidth={3}/><Area type="monotone" dataKey="saldo" stroke="#06b6d4" fill="#06b6d422" strokeWidth={3}/><Area type="monotone" dataKey="despesas" stroke="#ef4444" fill="#ef444422" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></div><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4">Despesas por categoria</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categorias} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>{categorias.map((_, i) => <Cell key={i} fill={cores[i % cores.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div></div><div className="grid md:grid-cols-3 gap-4">{contasUsuario.slice(0,3).map(c => <div key={c.id} className={`rounded-3xl p-5 bg-gradient-to-br ${c.cor} shadow-xl text-white`}><Building2/><p className="mt-4 text-sm opacity-90">{c.instituicao}</p><h3 className="text-2xl font-black">{c.nome}</h3><p className="text-3xl font-black mt-2">{dinheiro(c.saldo)}</p><p className="text-xs opacity-80">{c.tipo}</p></div>)}</div></section>;
}

function Resumo({ painel, painel2, textoSuave, dinheiro, economiaMensal, usoCartao, limiteCartao, investimentos, saldo, maiorCategoria, orcamentosEstourados, orcamentosAtencao, parcelamentos, saudeFinanceira }) {
  const rendimentoTotal = investimentos.reduce((s, i) => s + Number(i.rendimento), 0);
  return <section className="grid xl:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border xl:col-span-2`}><h3 className="text-xl font-bold mb-4">Resumo inteligente 6.0</h3><div className="grid md:grid-cols-3 gap-4"><InfoCard titulo="Economia mensal" valor={economiaMensal + '%'} texto="da renda mensal" painel2={painel2}/><InfoCard titulo="Uso dos cartões" valor={Math.round((usoCartao / Math.max(1, limiteCartao)) * 100) + '%'} texto="do limite total" painel2={painel2}/><InfoCard titulo="Rendimento" valor={dinheiro(rendimentoTotal)} texto="nos investimentos" painel2={painel2}/></div><div className={`rounded-3xl ${painel2} p-5 mt-5`}><p className="font-bold text-cyan-500">Diagnóstico</p><p className={`${textoSuave} mt-2`}>Você fechou o mês com saldo de {dinheiro(saldo)}. A categoria mais pesada é {maiorCategoria.name}. Existem {orcamentosEstourados.length} orçamento(s) estourado(s), {orcamentosAtencao.length} em atenção e {parcelamentos.length} parcelamento(s) ativo(s).</p></div></div><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4">Score financeiro</h3><div className="text-6xl font-black text-cyan-400">{saudeFinanceira}</div><p className={`${textoSuave} mt-3`}>Pontuação demonstrativa baseada em saldo, despesas, orçamento e uso de cartão.</p><div className={`h-4 rounded-full mt-5 ${painel2}`}><div className="h-4 rounded-full bg-cyan-400" style={{ width: saudeFinanceira + '%' }}></div></div></div></section>;
}

function Cartoes({ painel, input, dinheiro, cartoes, novoCartao, setNovoCartao, adicionarCartao, setCampo }) {
  return <section className="grid xl:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard size={20}/> Novo cartão</h3><div className="space-y-3"><input placeholder="Nome do cartão" value={novoCartao.nome} onChange={e=>setNovoCartao({...novoCartao,nome:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Banco" value={novoCartao.banco} onChange={e=>setNovoCartao({...novoCartao,banco:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Limite" type="number" value={novoCartao.limite} onChange={e=>setNovoCartao({...novoCartao,limite:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Utilizado" type="number" value={novoCartao.utilizado} onChange={e=>setNovoCartao({...novoCartao,utilizado:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><div className="grid grid-cols-2 gap-3"><input placeholder="Fechamento" type="number" value={novoCartao.fechamento} onChange={e=>setNovoCartao({...novoCartao,fechamento:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Vencimento" type="number" value={novoCartao.vencimento} onChange={e=>setNovoCartao({...novoCartao,vencimento:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/></div><button onClick={adicionarCartao} className="w-full rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">Adicionar cartão</button></div></div><div className="xl:col-span-2 grid md:grid-cols-2 gap-4">{cartoes.map(c => { const pct = Math.round((c.utilizado / Math.max(1, c.limite)) * 100); return <div key={c.id} className={`rounded-3xl p-5 bg-gradient-to-br ${c.cor} shadow-xl text-white`}><div className="flex justify-between"><CreditCard/><button onClick={()=>setCampo('cartoes', cartoes.filter(x => x.id !== c.id))} className="rounded-xl bg-white/20 p-2"><Trash2 size={16}/></button></div><p className="mt-4 text-sm opacity-90">{c.banco}</p><h3 className="text-2xl font-black">{c.nome}</h3><p className="text-sm mt-2">Fecha dia {c.fechamento} • Vence dia {c.vencimento}</p><p className="text-3xl font-black mt-3">{dinheiro(c.utilizado)}</p><p className="text-sm opacity-80">de {dinheiro(c.limite)} • {pct}% usado</p><div className="h-3 bg-white/20 rounded-full mt-4"><div className="h-3 bg-white rounded-full" style={{ width: Math.min(100, pct) + '%' }}></div></div></div>; })}</div></section>;
}

function Contas({ painel, input, dinheiro, contasUsuario, novaConta, setNovaConta, adicionarContaFinanceira, setCampo }) {
  return <section className="grid xl:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Building2 size={20}/> Nova conta</h3><div className="space-y-3"><input placeholder="Nome da conta" value={novaConta.nome} onChange={e=>setNovaConta({...novaConta,nome:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Instituição" value={novaConta.instituicao} onChange={e=>setNovaConta({...novaConta,instituicao:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><select value={novaConta.tipo} onChange={e=>setNovaConta({...novaConta,tipo:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}><option>Conta corrente</option><option>Poupança</option><option>Cartão</option><option>Investimento</option><option>Carteira digital</option></select><input placeholder="Saldo inicial" type="number" value={novaConta.saldo} onChange={e=>setNovaConta({...novaConta,saldo:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><button onClick={adicionarContaFinanceira} className="w-full rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">Adicionar conta</button></div></div><div className="xl:col-span-2 grid md:grid-cols-2 gap-4">{contasUsuario.map(c => <div key={c.id} className={`rounded-3xl p-5 bg-gradient-to-br ${c.cor} shadow-xl text-white`}><div className="flex justify-between items-start"><Building2/><button onClick={()=>setCampo('contasUsuario', contasUsuario.filter(x => x.id !== c.id))} className="rounded-xl bg-white/20 p-2"><Trash2 size={16}/></button></div><p className="mt-4 text-sm opacity-90">{c.instituicao}</p><h3 className="text-2xl font-black">{c.nome}</h3><p className="text-3xl font-black mt-3">{dinheiro(c.saldo)}</p><p className="text-xs opacity-80">{c.tipo}</p></div>)}</div></section>;
}

function Transacoes({ painel, painel2, input, textoSuave, dinheiro, contasUsuario, nova, setNova, editandoId, setEditandoId, adicionarOuAtualizarTransacao, transacoesFiltradas, editarTransacao, setCampo, transacoes, busca, setBusca, filtroTipo, setFiltroTipo, filtroCategoria, setFiltroCategoria, categoriasUnicas }) {
  return <section className="grid xl:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus size={20}/> {editandoId ? 'Editar transação' : 'Nova transação'}</h3><div className="space-y-3"><select value={nova.tipo} onChange={e=>setNova({...nova,tipo:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}><option>Despesa</option><option>Receita</option></select><input placeholder="Descrição" value={nova.descricao} onChange={e=>setNova({...nova,descricao:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Categoria" value={nova.categoria} onChange={e=>setNova({...nova,categoria:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><select value={nova.meio} onChange={e=>setNova({...nova,meio:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}><option>PIX enviado</option><option>PIX recebido</option><option>Débito</option><option>Crédito</option><option>Boleto</option><option>Transferência</option><option>Dinheiro</option></select><select value={nova.conta} onChange={e=>setNova({...nova,conta:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}>{contasUsuario.map(c => <option key={c.id}>{c.nome}</option>)}</select><input placeholder="Valor" type="number" value={nova.valor} onChange={e=>setNova({...nova,valor:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input type="date" value={nova.data} onChange={e=>setNova({...nova,data:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><label className={`flex items-center gap-2 rounded-2xl ${painel2} p-3`}><input type="checkbox" checked={nova.recorrente} onChange={e=>setNova({...nova,recorrente:e.target.checked})}/> Recorrente</label><button onClick={adicionarOuAtualizarTransacao} className="w-full rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">{editandoId ? 'Salvar alteração' : 'Adicionar'}</button>{editandoId && <button onClick={() => { setEditandoId(null); setNova({ tipo: 'Despesa', descricao: '', categoria: '', valor: '', data: '2026-08-20', conta: contasUsuario[0]?.nome || 'Conta principal', recorrente: false, meio: 'PIX enviado' }); }} className={`w-full rounded-2xl ${painel2} p-3`}>Cancelar edição</button>}</div></div><div className={`xl:col-span-2 rounded-3xl ${painel} p-6 border`}><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4"><h3 className="text-xl font-bold">Lançamentos</h3><div className="flex flex-wrap gap-2"><div className={`flex items-center gap-2 rounded-2xl px-3 ${painel2}`}><Search size={16}/><input value={busca} onChange={e=>setBusca(e.target.value)} className="bg-transparent p-2 outline-none w-36" placeholder="Buscar"/></div><div className={`flex items-center gap-2 rounded-2xl px-3 ${painel2}`}><Filter size={16}/><select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)} className="bg-transparent p-2 outline-none"><option>Todos</option><option>Receita</option><option>Despesa</option></select></div><select value={filtroCategoria} onChange={e=>setFiltroCategoria(e.target.value)} className={`rounded-2xl p-2 outline-none ${painel2}`}>{categoriasUnicas.map(c => <option key={c}>{c}</option>)}</select></div></div><div className="space-y-3">{transacoesFiltradas.slice().reverse().map(t => <div key={t.id} className={`flex items-center justify-between gap-3 rounded-2xl ${painel2} p-4`}><div><p className="font-semibold flex items-center gap-2">{t.descricao} {t.recorrente && <Repeat size={15} className="text-cyan-400"/>}</p><p className={`text-sm ${textoSuave}`}>{t.categoria} • {t.conta} • {t.meio} • {t.data}</p></div><div className="flex items-center gap-3"><span className={t.tipo === 'Receita' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{t.tipo === 'Receita' ? '+' : '-'} {dinheiro(t.valor)}</span><button onClick={() => editarTransacao(t)} className={`rounded-xl ${painel} p-2`}><Pencil size={16}/></button><button onClick={() => setCampo('transacoes', transacoes.filter(x => x.id !== t.id))} className="rounded-xl bg-rose-500/20 text-rose-400 p-2"><Trash2 size={16}/></button></div></div>)}</div></div></section>;
}

function Parcelas({ painel, painel2, input, textoSuave, dinheiro, parcelamentos, novoParcelamento, setNovoParcelamento, cartoes, adicionarParcelamento, setCampo }) {
  return <section className="grid xl:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><SplitSquareHorizontal size={20}/> Novo parcelamento</h3><div className="space-y-3"><input placeholder="Descrição" value={novoParcelamento.descricao} onChange={e=>setNovoParcelamento({...novoParcelamento,descricao:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Categoria" value={novoParcelamento.categoria} onChange={e=>setNovoParcelamento({...novoParcelamento,categoria:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Valor total" type="number" value={novoParcelamento.valorTotal} onChange={e=>setNovoParcelamento({...novoParcelamento,valorTotal:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Quantidade de parcelas" type="number" value={novoParcelamento.parcelas} onChange={e=>setNovoParcelamento({...novoParcelamento,parcelas:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><select value={novoParcelamento.cartao} onChange={e=>setNovoParcelamento({...novoParcelamento,cartao:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}>{cartoes.map(c => <option key={c.id}>{c.nome}</option>)}</select><button onClick={adicionarParcelamento} className="w-full rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">Gerar parcelamento</button></div></div><div className="xl:col-span-2 space-y-4">{parcelamentos.map(p => { const pct = Math.round((p.parcelaAtual / Math.max(1, p.parcelas)) * 100); return <div key={p.id} className={`rounded-3xl ${painel} p-5 border`}><div className="flex justify-between gap-3"><div><p className="font-black text-xl">{p.descricao}</p><p className={`${textoSuave}`}>{p.categoria} • {p.cartao}</p></div><button onClick={()=>setCampo('parcelamentos', parcelamentos.filter(x => x.id !== p.id))} className="rounded-xl bg-rose-500/20 text-rose-400 p-2 h-10"><Trash2 size={16}/></button></div><div className="grid md:grid-cols-4 gap-3 mt-4"><InfoCard titulo="Total" valor={dinheiro(p.valorTotal)} painel2={painel2}/><InfoCard titulo="Parcela" valor={dinheiro(p.valorParcela)} painel2={painel2}/><InfoCard titulo="Atual" valor={`${p.parcelaAtual}/${p.parcelas}`} painel2={painel2}/><InfoCard titulo="Progresso" valor={pct + '%'} painel2={painel2}/></div><div className={`h-4 rounded-full mt-4 ${painel2}`}><div className="h-4 rounded-full bg-cyan-400" style={{ width: Math.min(100, pct) + '%' }}></div></div></div>; })}</div></section>;
}

function Orcamentos({ painel, input, textoSuave, dinheiro, usoOrcamentos, orcamentos, novoOrcamento, setNovoOrcamento, adicionarOrcamento, setCampo, temaEscuro }) {
  return <section className="grid xl:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Gauge size={20}/> Novo orçamento</h3><div className="space-y-3"><input placeholder="Categoria" value={novoOrcamento.categoria} onChange={e=>setNovoOrcamento({...novoOrcamento,categoria:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Limite mensal" type="number" value={novoOrcamento.limite} onChange={e=>setNovoOrcamento({...novoOrcamento,limite:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><button onClick={adicionarOrcamento} className="w-full rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">Salvar orçamento</button></div></div><div className="xl:col-span-2 space-y-4">{usoOrcamentos.map(o => <div key={o.id} className={`rounded-3xl ${painel} p-5 border`}><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"><div><p className="font-black text-xl">{o.categoria}</p><p className={`${textoSuave} text-sm`}>{o.status} • Restante: {dinheiro(o.restante)}</p></div><div className="flex items-center gap-2"><span className={`font-black ${o.percentual >= 100 ? 'text-rose-400' : o.percentual >= 85 ? 'text-amber-400' : 'text-emerald-400'}`}>{o.percentual}%</span><button onClick={()=>setCampo('orcamentos', orcamentos.filter(x => x.id !== o.id))} className="rounded-xl bg-rose-500/20 text-rose-400 p-2"><Trash2 size={16}/></button></div></div><div className={`h-4 rounded-full mt-4 ${temaEscuro ? 'bg-slate-800' : 'bg-slate-200'}`}><div className={`h-4 rounded-full ${o.percentual >= 100 ? 'bg-rose-500' : o.percentual >= 85 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: Math.min(100, o.percentual) + '%' }}></div></div></div>)}</div></section>;
}

function Metas({ painel, painel2, input, textoSuave, dinheiro, metas, novaMeta, setNovaMeta, adicionarMeta, setCampo, saldo }) {
  return <section className="grid lg:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4">Nova meta inteligente</h3><div className="space-y-3"><input placeholder="Nome da meta" value={novaMeta.nome} onChange={e=>setNovaMeta({...novaMeta,nome:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Valor atual" type="number" value={novaMeta.atual} onChange={e=>setNovaMeta({...novaMeta,atual:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Valor alvo" type="number" value={novaMeta.alvo} onChange={e=>setNovaMeta({...novaMeta,alvo:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><select value={novaMeta.prioridade} onChange={e=>setNovaMeta({...novaMeta,prioridade:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}><option>Alta</option><option>Média</option><option>Baixa</option></select><button onClick={adicionarMeta} className="w-full rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">Adicionar meta</button></div></div><div className={`lg:col-span-2 rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-5">Metas financeiras</h3><div className="space-y-5">{metas.map(m => { const pct = Math.min(100, Math.round((Number(m.atual) / Math.max(1, Number(m.alvo))) * 100)); const faltam = Math.max(0, m.alvo - m.atual); const meses = saldo > 0 ? Math.ceil(faltam / Math.max(1, saldo * 0.3)) : null; return <div key={m.id}><div className="flex justify-between text-sm"><span>{m.nome} • Prioridade {m.prioridade}</span><span>{pct}%</span></div><div className={`h-4 ${painel2} rounded-full mt-2`}><div className={`h-4 rounded-full ${m.cor}`} style={{ width: pct + '%' }}></div></div><div className="flex justify-between items-center mt-1"><p className={`text-xs ${textoSuave}`}>{dinheiro(m.atual)} de {dinheiro(m.alvo)} • faltam {dinheiro(faltam)} {meses ? `• previsão ${meses} mês(es)` : ''}</p><button onClick={() => setCampo('metas', metas.filter(x => x.id !== m.id))} className="text-rose-400"><Trash2 size={15}/></button></div></div>; })}</div></div></section>;
}

function Investimentos({ painel, input, textoSuave, dinheiro, investimentos, novoInvestimento, setNovoInvestimento, adicionarInvestimento, setCampo }) {
  return <section className="grid xl:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><PiggyBank size={20}/> Novo investimento</h3><div className="space-y-3"><input placeholder="Nome" value={novoInvestimento.nome} onChange={e=>setNovoInvestimento({...novoInvestimento,nome:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><select value={novoInvestimento.tipo} onChange={e=>setNovoInvestimento({...novoInvestimento,tipo:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}><option>CDB</option><option>Tesouro</option><option>Fundo</option><option>Ações</option><option>Cripto</option></select><input placeholder="Valor aplicado" type="number" value={novoInvestimento.aplicado} onChange={e=>setNovoInvestimento({...novoInvestimento,aplicado:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><input placeholder="Rendimento" type="number" value={novoInvestimento.rendimento} onChange={e=>setNovoInvestimento({...novoInvestimento,rendimento:e.target.value})} className={`w-full rounded-2xl p-3 outline-none border ${input}`}/><button onClick={adicionarInvestimento} className="w-full rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">Salvar investimento</button></div></div><div className="xl:col-span-2 grid md:grid-cols-2 gap-4">{investimentos.map(i => <div key={i.id} className={`rounded-3xl ${painel} p-5 border`}><div className="flex justify-between"><PiggyBank className="text-emerald-400"/><button onClick={()=>setCampo('investimentos', investimentos.filter(x => x.id !== i.id))} className="rounded-xl bg-rose-500/20 text-rose-400 p-2"><Trash2 size={16}/></button></div><p className={`${textoSuave} text-sm mt-4`}>{i.tipo}</p><h3 className="text-2xl font-black">{i.nome}</h3><p className="text-3xl font-black text-emerald-400 mt-3">{dinheiro(Number(i.aplicado) + Number(i.rendimento))}</p><p className={`${textoSuave} text-sm`}>Aplicado {dinheiro(i.aplicado)} • Rendeu {dinheiro(i.rendimento)}</p></div>)}</div></section>;
}

function Calendario({ painel, painel2, textoSuave, dinheiro, transacoes, alertas }) {
  return <section className="grid lg:grid-cols-3 gap-6"><div className={`lg:col-span-2 rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4">Calendário financeiro</h3><div className="grid md:grid-cols-3 gap-3">{transacoes.filter(t=>t.tipo==='Despesa').map(t => <div key={t.id} className={`rounded-2xl ${painel2} p-4`}><p className={`text-sm ${textoSuave}`}>{t.data}</p><p className="font-bold mt-1 flex items-center gap-2">{t.descricao} {t.recorrente && <Repeat size={14}/>}</p><p className="text-rose-400">{dinheiro(t.valor)}</p></div>)}</div></div><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell size={20}/> Alertas</h3><div className="space-y-3">{alertas.map((a, i) => <div key={i} className={`rounded-2xl ${painel2} p-4`}><p className={`text-xs ${a.nivel === 'Urgente' ? 'text-rose-400' : a.nivel === 'Sistema' ? 'text-emerald-400' : 'text-cyan-500'}`}>{a.nivel}</p><p className="font-bold">{a.titulo}</p><p className={`text-sm ${textoSuave}`}>{a.detalhe}</p></div>)}</div></div></section>;
}

function IA({ painel, painel2, input, textoSuave, mensagem, setMensagem, respostaIA, despesas, receitas, maiorCategoria, gastosFixos, dinheiro }) {
  return <section className="grid lg:grid-cols-2 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Bot size={22}/> IA financeira</h3><div className={`rounded-3xl ${painel2} p-5 min-h-44`}><p className={`text-sm ${textoSuave}`}>Pergunta</p><p className="mt-1">{mensagem}</p><div className="mt-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-4 text-cyan-500">{respostaIA}</div></div><div className="mt-4 flex gap-2"><input value={mensagem} onChange={e=>setMensagem(e.target.value)} className={`flex-1 rounded-2xl p-3 outline-none border ${input}`} placeholder="Escreva uma pergunta financeira"/><button className="rounded-2xl bg-cyan-400 text-slate-950 font-bold px-5">Analisar</button></div></div><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4">Insights automáticos</h3><div className="space-y-3"><Insight texto="O app 6.0 já separa cartões, parcelas, investimentos e transações." painel2={painel2}/><Insight texto={`As despesas representam ${Math.round((despesas / Math.max(1, receitas)) * 100)}% das receitas.`} painel2={painel2}/><Insight texto={`Maior categoria de gasto: ${maiorCategoria.name}.`} painel2={painel2}/><Insight texto={`Gastos fixos recorrentes: ${dinheiro(gastosFixos)}.`} painel2={painel2}/></div></div></section>;
}

function Sync({ painel, painel2, textoSuave, usuario, preferencias, setUsuarioCampo, setPreferencia, simularSync, sincronizando, ultimoBackup, exportarDados, exportarCSV, importarDados }) {
  return <section className="grid lg:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Cloud size={22}/> Nuvem e Firebase</h3><p className={textoSuave}>Dados locais com estrutura preparada para Firebase Authentication e Firestore.</p><button onClick={simularSync} className="w-full mt-5 rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">{sincronizando ? 'Sincronizando...' : 'Preparar sincronização'}</button><div className={`rounded-2xl ${painel2} p-4 mt-4`}><p className="flex items-center gap-2"><Database className="text-amber-400"/>Próxima etapa: conectar Firebase real.</p></div></div><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Save size={22}/> Backup e exportação</h3><p className={textoSuave}>Último backup: {ultimoBackup}</p><button onClick={exportarDados} className="w-full mt-5 rounded-2xl bg-emerald-400 text-slate-950 font-bold p-3 flex items-center justify-center gap-2"><Download size={18}/> Exportar JSON</button><button onClick={exportarCSV} className="w-full mt-3 rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3 flex items-center justify-center gap-2"><FileSpreadsheet size={18}/> Exportar CSV</button><label className={`w-full mt-3 rounded-2xl ${painel2} font-bold p-3 flex items-center justify-center gap-2 cursor-pointer`}><Upload size={18}/> Importar backup<input type="file" accept="application/json" onChange={importarDados} className="hidden"/></label></div><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck size={22}/> Segurança</h3><div className="space-y-3"><Toggle texto="PIN de acesso" ativo={usuario.pinAtivo} onClick={()=>setUsuarioCampo('pinAtivo', !usuario.pinAtivo)} painel2={painel2}/><Toggle texto="Biometria demonstrativa" ativo={usuario.biometriaAtiva} onClick={()=>setUsuarioCampo('biometriaAtiva', !usuario.biometriaAtiva)} painel2={painel2}/><Toggle texto="Notificações" ativo={preferencias.notificacoes} onClick={()=>setPreferencia('notificacoes', !preferencias.notificacoes)} painel2={painel2}/></div></div></section>;
}

function Publicar({ painel, painel2, textoSuave, preferencias, instalarPWA }) {
  return <section className="grid lg:grid-cols-3 gap-6"><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Smartphone size={22}/> Instalar no iPhone</h3><ol className={`space-y-3 ${textoSuave} list-decimal list-inside`}><li>Publicar o projeto na Vercel.</li><li>Abrir o link pelo Safari do iPhone.</li><li>Tocar no botão Compartilhar.</li><li>Escolher Adicionar à Tela de Início.</li></ol><button onClick={instalarPWA} className="w-full mt-5 rounded-2xl bg-cyan-400 text-slate-950 font-bold p-3">Verificar instalação PWA</button><p className={`${textoSuave} text-sm mt-3`}>{preferencias.instalacaoPWA}</p></div><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><PackageCheck size={22}/> Arquivos necessários</h3><div className="space-y-3"><Insight texto="package.json com React, Vite, Recharts, Lucide e Tailwind." painel2={painel2}/><Insight texto="public/manifest.json para nome, cores e ícones." painel2={painel2}/><Insight texto="public/icon-192.png e public/icon-512.png." painel2={painel2}/><Insight texto="Deploy na Vercel conectado ao GitHub." painel2={painel2}/></div></div><div className={`rounded-3xl ${painel} p-6 border`}><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings size={22}/> Próxima etapa real</h3><p className={textoSuave}>Separar em pastas profissionais: components, pages, hooks, services, firebase, utils e assets.</p><div className={`rounded-2xl ${painel2} p-4 mt-4 text-sm ${textoSuave}`}><p>Depois conectar Firebase Authentication, Firestore e regras de segurança para usar no iPhone e computador com os mesmos dados.</p></div></div></section>;
}

function CardKPI({ card, dinheiro, painel, textoSuave }) {
  return <div className={`rounded-3xl ${painel} p-5 border shadow-xl`}><div className="flex justify-between items-start"><p className={`${textoSuave} text-sm`}>{card.t}</p><span className="text-cyan-400">{card.i}</span></div><h3 className={`text-2xl font-black mt-2 ${card.c}`}>{typeof card.v === 'number' ? dinheiro(card.v) : card.v}</h3></div>;
}
function Campo({ label, icon, value, onChange, placeholder, input }) {
  return <label className="block"><span className="text-sm text-slate-400">{label}</span><div className={`mt-2 flex items-center gap-3 rounded-2xl p-3 border ${input}`}><span className="text-cyan-500">{icon}</span><input value={value} onChange={e => onChange(e.target.value)} className="bg-transparent outline-none w-full" placeholder={placeholder}/></div></label>;
}
function FeatureMini({ icon, texto }) {
  return <div className="rounded-2xl bg-white/10 p-4">{icon}<p className="text-sm mt-2">{texto}</p></div>;
}
function InfoCard({ titulo, valor, texto, painel2 }) {
  return <div className={`rounded-2xl ${painel2} p-4`}><p className="text-sm opacity-70">{titulo}</p><p className="font-black text-lg mt-1">{valor}</p>{texto && <p className="text-xs opacity-70 mt-1">{texto}</p>}</div>;
}
function Insight({ texto, painel2 }) {
  return <div className={`rounded-2xl ${painel2} p-4`}>✅ {texto}</div>;
}
function Toggle({ texto, ativo, onClick, painel2 }) {
  return <button onClick={onClick} className={`w-full rounded-2xl ${painel2} p-4 flex items-center justify-between`}><span>{texto}</span><span className={`rounded-full px-3 py-1 text-sm font-bold ${ativo ? 'bg-emerald-400 text-slate-950' : 'bg-slate-600 text-white'}`}>{ativo ? 'Ativo' : 'Inativo'}</span></button>;
}
