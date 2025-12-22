import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Book, Users, Shield, Camera, Settings, MessageCircle } from 'lucide-react';

export default function SchoolFAQ() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItem, setOpenItem] = useState(null);

    const categories = [
        { id: 'all', label: 'Todas', icon: HelpCircle },
        { id: 'general', label: 'Geral', icon: Settings },
        { id: 'teachers', label: 'Professores', icon: Book },
        { id: 'students', label: 'Alunos', icon: Users },
        { id: 'facial', label: 'Reconhecimento Facial', icon: Camera },
        { id: 'privacy', label: 'Privacidade & Segurança', icon: Shield },
        { id: 'support', label: 'Suporte', icon: MessageCircle },
    ];

    const faqData = [
        // --- GERAL ---
        { category: 'general', q: 'O que é o sistema EduFocus?', a: 'O EduFocus é uma plataforma completa de gestão escolar que utiliza inteligência artificial para automação de chamadas, monitoramento de atenção e gestão de turmas.' },
        { category: 'general', q: 'Como faço para alterar minha senha?', a: 'No momento, para alterar sua senha, entre em contato com o administrador do sistema ou utilize a opção "Esqueci minha senha" na tela de login se disponível.' },
        { category: 'general', q: 'O sistema funciona em celular?', a: 'Sim, o EduFocus é responsivo e pode ser acessado via navegador em smartphones e tablets, embora a melhor experiência para gestão seja em computadores.' },
        { category: 'general', q: 'Preciso instalar algum programa?', a: 'Não. O EduFocus é 100% online e funciona diretamente no seu navegador (Chrome, Firefox, Edge, etc.).' },
        { category: 'general', q: 'O sistema está lento, o que fazer?', a: 'Verifique sua conexão com a internet. Se o problema persistir, tente limpar o cache do navegador ou entre em contato com o suporte.' },
        { category: 'general', q: 'Posso ter mais de uma conta?', a: 'Cada usuário deve ter uma única conta vinculada ao seu CPF/E-mail profissional para garantir a segurança dos dados.' },
        { category: 'general', q: 'Como vejo as notificações?', a: 'As notificações aparecem no ícone de sino no canto superior direito da tela quando há novas mensagens ou alertas do sistema.' },
        { category: 'general', q: 'O sistema tem modo noturno?', a: 'Sim, o design atual já utiliza um tema escuro moderno para conforto visual e economia de energia.' },

        // --- PROFESSORES ---
        { category: 'teachers', q: 'Como vinculo um novo professor?', a: 'Vá até a aba "Professores", clique em "Buscar e Vincular Professor", digite o e-mail dele e selecione as turmas que ele poderá acessar.' },
        { category: 'teachers', q: 'O professor não aparece na busca, por quê?', a: 'Certifique-se de que o professor já criou uma conta na plataforma. A busca só encontra usuários registrados.' },
        { category: 'teachers', q: 'Posso desvincular um professor?', a: 'Sim. Na lista de professores, encontre o nome desejado e clique no botão "Desvincular". Ele perderá o acesso às turmas da sua escola.' },
        { category: 'teachers', q: 'O professor vê dados de outros professores?', a: 'Não. Cada professor tem acesso apenas às suas próprias turmas e alunos atribuídos.' },
        { category: 'teachers', q: 'Como o professor lança notas?', a: 'O lançamento de notas é feito no painel do professor, dentro da turma específica, na aba "Avaliações".' },
        { category: 'teachers', q: 'É possível vincular o mesmo professor em várias turmas?', a: 'Sim. Durante o vínculo, você pode selecionar múltiplas caixas de seleção correspondentes às turmas desejadas.' },
        { category: 'teachers', q: 'O que fazer se o professor esqueceu a senha?', a: 'Oriente-o a usar a função de recuperação de senha na tela inicial ou contate o suporte para um reset manual se necessário.' },
        { category: 'teachers', q: 'Posso ver o histórico de atividades do professor?', a: 'Ainda não temos um log detalhado de atividades visível para a escola, mas o sistema registra acessos internamente por segurança.' },

        // --- ALUNOS ---
        { category: 'students', q: 'Como cadastro um aluno novo?', a: 'Acesse a aba "Alunos", clique em "Cadastrar Aluno" e preencha os dados obrigatórios: Nome, Turma e Foto para o reconhecimento.' },
        { category: 'students', q: 'Qual o tamanho ideal para a foto do aluno?', a: 'Recomendamos fotos de rosto (tipo 3x4), bem iluminadas, sem acessórios que cubram a face, com tamanho máximo de 5MB.' },
        { category: 'students', q: 'O aluno pode ter mais de uma foto?', a: 'Atualmente o sistema utiliza uma foto principal para gerar o descritor facial. Você pode atualizar essa foto a qualquer momento.' },
        { category: 'students', q: 'Como excluir um aluno?', a: 'Na lista de alunos, clique no ícone de lixeira (Excluir) ao lado do nome do aluno. Cuidado: essa ação remove o histórico de presença.' },
        { category: 'students', q: 'Posso mudar o aluno de turma?', a: 'Sim. Edite o cadastro do aluno e selecione a nova turma no campo correspondente.' },
        { category: 'students', q: 'Onde vejo os contatos dos pais?', a: 'Na lista de alunos, os detalhes como telefone e e-mail dos responsáveis estão visíveis no cartão do aluno.' },
        { category: 'students', q: 'O sistema avisa os pais sobre faltas?', a: 'Sim, se configurado, o sistema pode enviar notificações automáticas para o app dos pais quando a falta é registrada.' },
        { category: 'students', q: 'Como cadastro alunos em massa?', a: 'Atualmente o cadastro é individual. A importação via planilha (Excel/CSV) está em desenvolvimento para as próximas versões.' },
        { category: 'students', q: 'O que é o "descritor facial"?', a: 'É uma representação matemática única do rosto do aluno usada pela IA para identificá-lo. Não é a foto em si, mas um código numérico.' },

        // --- RECONHECIMENTO FACIAL ---
        { category: 'facial', q: 'Como funciona a chamada automática?', a: 'Uma câmera na entrada ou sala processa o vídeo em tempo real. Quando reconhece o rosto do aluno, registra a presença automaticamente com data e hora.' },
        { category: 'facial', q: 'O sistema reconhece com máscara?', a: 'A precisão diminui com máscaras. Recomendamos que o aluno abaixe a máscara brevemente para a identificação correta.' },
        { category: 'facial', q: 'E se o aluno usa óculos?', a: 'O sistema geralmente reconhece bem com óculos de grau. Óculos escuros ou com reflexo muito forte podem atrapalhar.' },
        { category: 'facial', q: 'A iluminação afeta o reconhecimento?', a: 'Sim! Locais muito escuros ou com luz forte diretamente atrás do aluno (contra-luz) dificultam a detecção. Mantenha o ambiente bem iluminado.' },
        { category: 'facial', q: 'Quanto tempo leva para reconhecer?', a: 'O processo leva menos de 1 segundo em condições ideais de hardware e internet.' },
        { category: 'facial', q: 'O sistema confunde gêmeos?', a: 'Gêmeos idênticos são um desafio para qualquer IA. Nesses casos, recomendamos a conferência manual da presença.' },
        { category: 'facial', q: 'Onde ficam as câmeras?', a: 'Podem ser instaladas na entrada da escola (catracas) ou dentro da sala de aula, dependendo do plano contratado.' },
        { category: 'facial', q: 'Preciso de internet para o reconhecimento?', a: 'Sim, o processamento e o envio dos dados para o servidor dependem de uma conexão estável.' },
        { category: 'facial', q: 'O que significa "Score" ou "Confiança"?', a: 'É a certeza da IA de que aquele rosto é quem ela diz ser. Configuramos para aceitar apenas identificações com alta certeza (>60%).' },
        { category: 'facial', q: 'Posso usar qualquer webcam?', a: 'Sim, mas recomendamos câmeras HD (720p ou superior) com boa captura de luz para garantir a precisão.' },

        // --- PRIVACIDADE ---
        { category: 'privacy', q: 'As fotos dos alunos são públicas?', a: 'Não. As fotos e dados biométricos são criptografados e acessíveis apenas pela administração escolar autorizada.' },
        { category: 'privacy', q: 'O sistema está adequado à LGPD?', a: 'Sim. Seguimos as diretrizes da Lei Geral de Proteção de Dados, garantindo o direito à privacidade e proteção dos dados de menores.' },
        { category: 'privacy', q: 'Quem tem acesso às câmeras?', a: 'Apenas a direção da escola e os professores (apenas de suas salas) têm acesso às imagens em tempo real.' },
        { category: 'privacy', q: 'Por quanto tempo os dados ficam salvos?', a: 'Os registros de presença são mantidos pelo ano letivo corrente. Imagens de vídeo não são gravadas continuamente, apenas snapshots de presença.' },
        { category: 'privacy', q: 'Os pais autorizam o reconhecimento?', a: 'Sim. A escola deve recolher o termo de consentimento dos pais ou responsáveis no ato da matrícula para uso da biometria.' },
        { category: 'privacy', q: 'Onde os dados ficam hospedados?', a: 'Utilizamos servidores seguros em nuvem com certificações internacionais de segurança.' },

        // --- SUPORTE ---
        { category: 'support', q: 'Como abro um chamado técnico?', a: 'Vá na aba "Suporte" do painel, descreva o problema no campo de texto e clique em "Enviar". Nossa equipe responderá em breve.' },
        { category: 'support', q: 'Qual o horário de atendimento?', a: 'Nosso suporte funciona de segunda a sexta, das 08h às 18h. Emergências podem ser tratadas via plantão.' },
        { category: 'support', q: 'Onde vejo manuais de uso?', a: 'Estamos implementando uma base de conhecimento. Por enquanto, consulte estas FAQs ou solicite PDFs ao nosso time.' },
        { category: 'support', q: 'Tenho uma sugestão de melhoria, onde envio?', a: 'Adoramos feedback! Envie sua ideia pela aba de Suporte com o título "Sugestão".' },
        { category: 'support', q: 'Existe treinamento para professores?', a: 'Sim. Oferecemos webinars e vídeos tutoriais. Solicite o link de acesso ao seu gestor de conta.' },
        { category: 'support', q: 'O que fazer se a câmera quebrar?', a: 'Se for um equipamento fornecido pela EduFocus em comodato, abrimos um chamado para troca imediata.' }
    ];

    const filteredFAQs = faqData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.a.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleItem = (index) => {
        if (openItem === index) {
            setOpenItem(null);
        } else {
            setOpenItem(index);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Como podemos ajudar?
                </h2>
                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                    <input
                        type="text"
                        placeholder="Busque por dúvida, palavra-chave..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                        style={{
                            paddingLeft: '3rem',
                            fontSize: '1.1rem',
                            background: 'rgba(255,255,255,0.08)',
                            borderColor: 'transparent',
                            borderRadius: '50px'
                        }}
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                </div>
            </div>

            {/* Categories */}
            <div style={{
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                marginBottom: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setOpenItem(null); }}
                        className={`btn ${activeCategory === cat.id ? 'btn-primary' : ''}`}
                        style={{
                            background: activeCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            border: activeCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50px',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1.25rem'
                        }}
                    >
                        <cat.icon size={16} />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Accordion List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredFAQs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <HelpCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>Nenhuma pergunta encontrada para sua busca.</p>
                    </div>
                ) : (
                    filteredFAQs.map((faq, index) => (
                        <div
                            key={index}
                            className="glass-panel"
                            onClick={() => toggleItem(index)}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2sease',
                                border: openItem === index ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <div style={{
                                padding: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: openItem === index ? 'var(--primary)' : 'var(--text-primary)',
                                    margin: 0
                                }}>
                                    {faq.q}
                                </h3>
                                {openItem === index ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
                            </div>

                            {openItem === index && (
                                <div className="animate-fade-in" style={{
                                    padding: '0 1.5rem 1.5rem 1.5rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.6',
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                    marginTop: '-0.5rem',
                                    paddingTop: '1rem'
                                }}>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
