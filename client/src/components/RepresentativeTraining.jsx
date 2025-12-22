import { useState, useEffect, useCallback } from 'react';
import {
    BookOpen, Clock, CheckCircle, Award, TrendingUp,
    PlayCircle, Lock, ChevronRight, Star, Trophy
} from 'lucide-react';

export default function RepresentativeTraining() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [userProgress, setUserProgress] = useState({
        name: "Representante",
        progress: {
            module1: { completed: false, score: 0, timeSpent: 0, answers: {} },
            module2: { completed: false, score: 0, timeSpent: 0, answers: {} },
            module3: { completed: false, score: 0, timeSpent: 0, answers: {} },
            module4: { completed: false, score: 0, timeSpent: 0, answers: {} },
            module5: { completed: false, score: 0, timeSpent: 0, answers: {} }
        },
        totalTime: 0,
        quizzesTaken: 0
    });

    // Carregar progresso do localStorage
    useEffect(() => {
        const saved = localStorage.getItem('rep_training_progress');
        if (saved) {
            setUserProgress(JSON.parse(saved));
        }
    }, []);

    // Salvar progresso no localStorage
    useEffect(() => {
        localStorage.setItem('rep_training_progress', JSON.stringify(userProgress));
    }, [userProgress]);

    // Calcular estatísticas
    const calculateStats = useCallback(() => {
        const modules = Object.values(userProgress.progress);
        const completed = modules.filter(m => m.completed).length;
        const totalModules = modules.length;
        const progressPercent = Math.round((completed / totalModules) * 100);

        const totalScore = modules.reduce((sum, m) => sum + (m.completed ? m.score : 0), 0);
        const averageScore = completed > 0 ? Math.round(totalScore / completed) : 0;

        // Determinar nível
        let level = "bronze";
        if (progressPercent >= 40 && averageScore >= 70) level = "prata";
        if (progressPercent >= 80 && averageScore >= 80) level = "ouro";
        if (progressPercent === 100 && averageScore >= 90) level = "diamante";

        return {
            progressPercent,
            averageScore,
            completedModules: completed,
            totalModules,
            level,
            totalTime: userProgress.totalTime
        };
    }, [userProgress]);

    const stats = calculateStats();

    const updateUserProgress = (module, score, timeSpent, answers) => {
        setUserProgress(prev => ({
            ...prev,
            progress: {
                ...prev.progress,
                [module]: {
                    completed: true,
                    score,
                    timeSpent: prev.progress[module].timeSpent + timeSpent,
                    answers
                }
            },
            totalTime: prev.totalTime + timeSpent,
            quizzesTaken: prev.quizzesTaken + 1
        }));
    };

    if (currentPage === 'dashboard') {
        return <TrainingDashboard stats={stats} userProgress={userProgress} setCurrentPage={setCurrentPage} />;
    }

    if (currentPage.startsWith('module')) {
        return (
            <CourseModule
                moduleId={currentPage.replace('module', '')}
                userProgress={userProgress}
                updateUserProgress={updateUserProgress}
                setCurrentPage={setCurrentPage}
            />
        );
    }

    if (currentPage === 'certificate') {
        return <Certificate userProgress={userProgress} stats={stats} />;
    }

    return null;
}

// Dashboard do Treinamento
function TrainingDashboard({ stats, userProgress, setCurrentPage }) {
    const handleContinueCourse = () => {
        // Encontrar próximo módulo não concluído
        for (let i = 1; i <= 5; i++) {
            if (!userProgress.progress[`module${i}`].completed) {
                setCurrentPage(`module${i}`);
                return;
            }
        }
        setCurrentPage('certificate');
    };

    const getModuleName = (num) => {
        const names = {
            1: 'Fundamentos da Plataforma',
            2: 'Modelo Financeiro',
            3: 'Identificação de Público',
            4: 'Técnicas de Abordagem',
            5: 'Fechamento de Vendas'
        };
        return names[num];
    };

    const getLevelColor = (level) => {
        const colors = {
            bronze: '#CD7F32',
            prata: '#C0C0C0',
            ouro: '#FFD700',
            diamante: '#b9f2ff'
        };
        return colors[level] || colors.bronze;
    };

    return (
        <div className="fade-in">
            {/* Header com Estatísticas */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                            Treinamento EduFocus
                        </h1>
                        <p style={{ opacity: 0.9 }}>
                            Torne-se um especialista em vendas da plataforma
                        </p>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '1rem 1.5rem',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                            Nível Atual
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: getLevelColor(stats.level)
                        }}>
                            {stats.level.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        padding: '1rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <TrendingUp size={20} />
                            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Progresso</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stats.progressPercent}%</div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        padding: '1rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <CheckCircle size={20} />
                            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Módulos</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                            {stats.completedModules}/{stats.totalModules}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        padding: '1rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Star size={20} />
                            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Pontuação</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                            {stats.averageScore}%
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        padding: '1rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Clock size={20} />
                            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Tempo</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                            {Math.floor(stats.totalTime / 60)}h
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Módulos */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                Módulos do Curso
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {[1, 2, 3, 4, 5].map(num => {
                    const module = userProgress.progress[`module${num}`];
                    const isCompleted = module.completed;
                    const isAvailable = num === 1 || userProgress.progress[`module${num - 1}`].completed;

                    return (
                        <div
                            key={num}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                opacity: isAvailable ? 1 : 0.6,
                                transition: 'all 0.3s ease',
                                border: isCompleted ? '2px solid var(--success)' : '1px solid var(--border)'
                            }}
                            onClick={() => isAvailable && setCurrentPage(`module${num}`)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    background: isCompleted
                                        ? 'linear-gradient(135deg, var(--success) 0%, #34d399 100%)'
                                        : isAvailable
                                            ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)'
                                            : 'var(--bg-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontWeight: '700'
                                }}>
                                    {isCompleted ? <CheckCircle size={32} /> : isAvailable ? num : <Lock size={28} />}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                        Módulo {num}: {getModuleName(num)}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {isCompleted ? (
                                            <>
                                                <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                                                    ✓ Concluído
                                                </span>
                                                <span>Pontuação: {module.score}%</span>
                                                <span>Tempo: {Math.floor(module.timeSpent / 60)}h {module.timeSpent % 60}m</span>
                                            </>
                                        ) : isAvailable ? (
                                            <>
                                                <Clock size={14} />
                                                <span>~30 minutos</span>
                                                <BookOpen size={14} />
                                                <span>Quiz incluído</span>
                                            </>
                                        ) : (
                                            <span>Bloqueado - Complete o módulo anterior</span>
                                        )}
                                    </div>
                                </div>

                                {isAvailable && (
                                    <ChevronRight size={24} style={{ color: 'var(--text-secondary)' }} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Botão de Ação */}
            <div style={{ textAlign: 'center' }}>
                <button
                    className="btn btn-primary"
                    onClick={handleContinueCourse}
                    style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
                >
                    {stats.progressPercent > 0 ? (
                        <>
                            <PlayCircle size={20} />
                            Continuar Treinamento
                        </>
                    ) : (
                        <>
                            <PlayCircle size={20} />
                            Começar Treinamento
                        </>
                    )}
                </button>
            </div>

            {/* Certificação */}
            {stats.completedModules === stats.totalModules && stats.averageScore >= 70 && (
                <div style={{
                    marginTop: '2rem',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)',
                    border: '2px solid var(--success)',
                    borderRadius: '16px',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <Trophy size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--success)' }}>
                        Parabéns! Você está certificado!
                    </h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        Você completou todos os módulos com sucesso. Baixe seu certificado agora!
                    </p>
                    <button
                        className="btn btn-success"
                        onClick={() => setCurrentPage('certificate')}
                    >
                        <Award size={20} />
                        Ver Certificado
                    </button>
                </div>
            )}
        </div>
    );
}

// Componente de Módulo do Curso
function CourseModule({ moduleId, userProgress, updateUserProgress, setCurrentPage }) {
    const [timeSpent, setTimeSpent] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    const moduleData = {
        1: {
            title: "Fundamentos da Plataforma EduFocus",
            description: "Conheça os pilares da nossa solução educacional",
            content: [
                {
                    title: "O que é a EduFocus?",
                    text: "A EduFocus é uma plataforma tecnológica completa que revoluciona a gestão escolar através de inovação e inteligência de dados. Oferecemos uma solução integrada que combina hardware, software e suporte técnico.",
                    points: [
                        "Controle de acesso com identificação automática",
                        "Monitoramento comportamental com câmeras inteligentes",
                        "Tablets educacionais com aplicativos pedagógicos",
                        "Dashboard de análise de dados para gestores",
                        "Painel de controle para pais e responsáveis"
                    ]
                },
                {
                    title: "Diferenciais Competitivos",
                    text: "O que nos torna únicos no mercado:",
                    points: [
                        "Zero custo de implantação para a escola",
                        "Todos os equipamentos incluídos (tablets, câmeras, leitores)",
                        "Modelo flexível de cobrança - a escola escolhe",
                        "Suporte técnico 24/7 incluso",
                        "Atualizações gratuitas contínuas"
                    ],
                    highlight: "Diferente da concorrência, a escola não precisa investir em equipamentos ou licenças caras!"
                }
            ]
        },
        2: {
            title: "Modelo Financeiro e Precificação",
            description: "Domine os modelos de cobrança e mostre o valor real",
            content: [
                {
                    title: "Modelo 1: Cobrança Direta aos Pais",
                    text: "A ESCOLA NÃO PAGA NADA! Os pais assinam o serviço diretamente.",
                    points: [
                        "Escola recebe equipamentos e sistema gratuitamente",
                        "Pais pagam apenas R$ 22,90/mês por aluno",
                        "Contrato direto entre EduFocus e os pais",
                        "Instalação e manutenção totalmente inclusas",
                        "Ideal para escolas que querem inovar sem risco financeiro"
                    ]
                },
                {
                    title: "Modelo 2: Repasse pela Escola",
                    text: "A escola cobra um valor acessível e tem lucro garantido.",
                    points: [
                        "Escola cobra R$ 34,50 por aluno/mês",
                        "Custo EduFocus: R$ 22,90 por aluno",
                        "Lucro da escola: R$ 11,60 por aluno",
                        "Exemplo: 500 alunos = R$ 5.800/mês de lucro",
                        "ROI imediato e fluxo de caixa positivo"
                    ],
                    highlight: "Além de modernizar, a escola gera receita extra mensal!"
                }
            ]
        },
        3: {
            title: "Identificação de Público-Alvo",
            description: "Aprenda a identificar e qualificar leads",
            content: [
                {
                    title: "Perfil Ideal de Cliente",
                    text: "Escolas que mais se beneficiam da EduFocus:",
                    points: [
                        "Escolas particulares de pequeno a médio porte (200-1000 alunos)",
                        "Instituições que buscam modernização tecnológica",
                        "Gestores preocupados com segurança e controle",
                        "Escolas que valorizam comunicação com pais",
                        "Instituições em crescimento ou expansão"
                    ]
                },
                {
                    title: "Sinais de Interesse",
                    text: "Indicadores de que a escola está pronta para fechar:",
                    points: [
                        "Reclamações de pais sobre comunicação",
                        "Problemas com controle de entrada/saída",
                        "Dificuldade em acompanhar desempenho dos alunos",
                        "Concorrência já usando tecnologia similar",
                        "Orçamento disponível para inovação"
                    ]
                }
            ]
        },
        4: {
            title: "Técnicas de Abordagem",
            description: "Domine a arte da primeira impressão",
            content: [
                {
                    title: "Preparação da Visita",
                    text: "Antes de visitar a escola:",
                    points: [
                        "Pesquise sobre a escola (site, redes sociais)",
                        "Identifique o decisor (diretor, coordenador)",
                        "Prepare materiais de apresentação",
                        "Tenha cases de sucesso similares",
                        "Agende com antecedência"
                    ]
                },
                {
                    title: "Durante a Apresentação",
                    text: "Como conduzir a reunião:",
                    points: [
                        "Comece perguntando sobre os desafios atuais",
                        "Apresente a solução focando nos benefícios",
                        "Mostre demonstração prática (vídeos/fotos)",
                        "Deixe o cliente falar e tire dúvidas",
                        "Feche com próximos passos claros"
                    ],
                    highlight: "Escute mais do que fale! Entenda a dor antes de apresentar a solução."
                }
            ]
        },
        5: {
            title: "Fechamento de Vendas",
            description: "Técnicas avançadas para converter leads",
            content: [
                {
                    title: "Superando Objeções",
                    text: "Respostas para objeções comuns:",
                    points: [
                        "\"É caro\" → Mostre o ROI e compare com concorrentes",
                        "\"Vou pensar\" → Crie urgência com promoções limitadas",
                        "\"Não tenho orçamento\" → Apresente o modelo sem custo inicial",
                        "\"Preciso consultar\" → Ofereça apresentação para o board",
                        "\"Já temos sistema\" → Mostre diferenciais únicos"
                    ]
                },
                {
                    title: "Fechamento Efetivo",
                    text: "Como fechar a venda:",
                    points: [
                        "Use fechamento assumido: \"Quando podemos instalar?\"",
                        "Ofereça escolha limitada: \"Modelo 1 ou 2?\"",
                        "Crie senso de urgência: \"Promoção válida até...\"",
                        "Facilite a decisão: \"Começamos com teste piloto?\"",
                        "Garanta suporte: \"Estaremos com vocês em cada etapa\""
                    ],
                    highlight: "O fechamento começa no primeiro contato. Construa confiança desde o início!"
                }
            ]
        }
    };

    const quizData = {
        1: [
            {
                id: 1,
                question: "Qual é o principal diferencial da EduFocus?",
                options: [
                    "Preço mais barato",
                    "Implantação sem custo para escola",
                    "Mais funcionalidades",
                    "Marca mais conhecida"
                ],
                correct: 1
            },
            {
                id: 2,
                question: "O que está incluído na implantação?",
                options: [
                    "Apenas software",
                    "Software e tablets",
                    "Tablets, câmeras e sistema completo",
                    "A escola compra separadamente"
                ],
                correct: 2
            }
        ],
        2: [
            {
                id: 1,
                question: "No modelo de cobrança direta, quanto custa por aluno?",
                options: [
                    "R$ 15,90",
                    "R$ 22,90",
                    "R$ 29,90",
                    "R$ 34,50"
                ],
                correct: 1
            },
            {
                id: 2,
                question: "Qual o lucro da escola por aluno no modelo de repasse?",
                options: [
                    "R$ 5,60",
                    "R$ 8,90",
                    "R$ 11,60",
                    "R$ 15,20"
                ],
                correct: 2
            }
        ],
        3: [
            {
                id: 1,
                question: "Qual o perfil ideal de escola para EduFocus?",
                options: [
                    "Escolas públicas grandes",
                    "Escolas particulares pequenas/médias",
                    "Universidades",
                    "Cursos livres"
                ],
                correct: 1
            }
        ],
        4: [
            {
                id: 1,
                question: "O que fazer ANTES de visitar uma escola?",
                options: [
                    "Ir direto sem preparação",
                    "Pesquisar sobre a escola",
                    "Ligar sem agendar",
                    "Enviar email genérico"
                ],
                correct: 1
            }
        ],
        5: [
            {
                id: 1,
                question: "Como responder à objeção 'É caro'?",
                options: [
                    "Baixar o preço imediatamente",
                    "Desistir da venda",
                    "Mostrar ROI e comparar com concorrentes",
                    "Ignorar a objeção"
                ],
                correct: 2
            }
        ]
    };

    const module = moduleData[moduleId];
    const quiz = quizData[moduleId] || [];

    const handleSubmitQuiz = () => {
        let correct = 0;
        quiz.forEach(q => {
            if (selectedAnswers[q.id] === q.correct) {
                correct++;
            }
        });

        const calculatedScore = Math.round((correct / quiz.length) * 100);
        setScore(calculatedScore);
        setSubmitted(true);

        updateUserProgress(`module${moduleId}`, calculatedScore, timeSpent, selectedAnswers);
    };

    const handleNextModule = () => {
        const nextId = parseInt(moduleId) + 1;
        if (nextId <= 5) {
            setCurrentPage(`module${nextId}`);
        } else {
            setCurrentPage('certificate');
        }
    };

    return (
        <div className="fade-in">
            {/* Header do Módulo */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                color: 'white'
            }}>
                <button
                    onClick={() => setCurrentPage('dashboard')}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    ← Voltar ao Dashboard
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Módulo {moduleId}: {module.title}
                </h1>
                <p style={{ opacity: 0.9 }}>{module.description}</p>
            </div>

            {/* Conteúdo do Módulo */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                {module.content.map((section, index) => (
                    <div key={index} style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary)' }}>
                            {section.title}
                        </h2>
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                            {section.text}
                        </p>
                        {section.points && (
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}>
                                {section.points.map((point, i) => (
                                    <li key={i} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                        padding: '0.75rem',
                                        background: 'rgba(79, 70, 229, 0.05)',
                                        borderRadius: '8px',
                                        borderLeft: '3px solid var(--primary)'
                                    }}>
                                        <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {section.highlight && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                                borderLeft: '4px solid var(--primary)',
                                borderRadius: '0 8px 8px 0',
                                fontWeight: '600',
                                color: 'var(--primary)'
                            }}>
                                💡 {section.highlight}
                            </div>
                        )}
                    </div>
                ))}

                {!showQuiz && !userProgress.progress[`module${moduleId}`]?.completed && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowQuiz(true)}
                        >
                            <PlayCircle size={20} />
                            Iniciar Questionário
                        </button>
                    </div>
                )}
            </div>

            {/* Quiz */}
            {showQuiz && !userProgress.progress[`module${moduleId}`]?.completed && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                        Questionário - Módulo {moduleId}
                    </h2>

                    {quiz.map((question, qIndex) => (
                        <div key={question.id} style={{ marginBottom: '2rem' }}>
                            <div style={{
                                fontWeight: '600',
                                marginBottom: '1rem',
                                fontSize: '1.125rem'
                            }}>
                                {qIndex + 1}. {question.question}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {question.options.map((option, oIndex) => {
                                    const isSelected = selectedAnswers[question.id] === oIndex;
                                    const isCorrect = submitted && oIndex === question.correct;
                                    const isWrong = submitted && isSelected && oIndex !== question.correct;

                                    return (
                                        <div
                                            key={oIndex}
                                            onClick={() => !submitted && setSelectedAnswers({ ...selectedAnswers, [question.id]: oIndex })}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                border: `2px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--danger)' : isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                                background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : isWrong ? 'rgba(239, 68, 68, 0.1)' : isSelected ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                                cursor: submitted ? 'default' : 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {option}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {!submitted ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(selectedAnswers).length < quiz.length}
                            style={{ opacity: Object.keys(selectedAnswers).length < quiz.length ? 0.5 : 1 }}
                        >
                            Enviar Respostas
                        </button>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: score >= 70 ? 'var(--success)' : 'var(--danger)',
                                marginBottom: '1rem'
                            }}>
                                Pontuação: {score}%
                            </div>
                            <button className="btn btn-success" onClick={handleNextModule}>
                                {parseInt(moduleId) < 5 ? 'Próximo Módulo' : 'Ver Certificado'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Módulo Concluído */}
            {userProgress.progress[`module${moduleId}`]?.completed && (
                <div className="glass-panel" style={{
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)',
                    border: '2px solid var(--success)'
                }}>
                    <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--success)' }}>
                        Módulo Concluído!
                    </h3>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Você completou este módulo com {userProgress.progress[`module${moduleId}`].score}% de acerto.
                    </p>
                    <button className="btn btn-primary" onClick={handleNextModule}>
                        {parseInt(moduleId) < 5 ? 'Próximo Módulo' : 'Ver Certificado'}
                    </button>
                </div>
            )}
        </div>
    );
}

// Componente de Certificado
function Certificate({ userProgress, stats }) {
    const isCertified = stats.completedModules === stats.totalModules && stats.averageScore >= 70;

    if (!isCertified) {
        return (
            <div className="fade-in">
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Lock size={64} style={{ color: 'var(--text-secondary)', margin: '0 auto 1.5rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                        Certificação Bloqueada
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Complete todos os módulos com pontuação mínima de 70% para desbloquear seu certificado.
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                                {stats.completedModules}/5
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Módulos Completos
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                                {stats.averageScore}%
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Pontuação Média
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
                borderRadius: '16px',
                padding: '3rem',
                color: 'white',
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <Trophy size={80} style={{ margin: '0 auto 1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                    Parabéns!
                </h1>
                <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                    Você completou todos os requisitos para a certificação
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary)' }}>
                        Certificado de Representante Certificado EduFocus
                    </h2>
                    <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
                        Certificamos que <strong>{userProgress.name}</strong> completou com êxito o treinamento de Representante Comercial EduFocus.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Nível Alcançado
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                            {stats.level.toUpperCase()}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Pontuação Final
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                            {stats.averageScore}%
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Data de Emissão
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                            {new Date().toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-primary" onClick={() => window.print()}>
                        <Award size={20} />
                        Imprimir Certificado
                    </button>
                </div>
            </div>
        </div>
    );
}
