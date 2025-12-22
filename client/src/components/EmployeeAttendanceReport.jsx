import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import api from '../api/axios';

export default function EmployeeAttendanceReport({ schoolId }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
    const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);

    useEffect(() => {
        loadEmployees();
    }, []);

    useEffect(() => {
        loadAttendanceData();
    }, [selectedMonth, selectedEmployee]);

    const loadEmployees = async () => {
        try {
            const res = await api.get('/school/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error('Erro ao carregar funcionários:', err);
        }
    };

    const loadAttendanceData = async () => {
        try {
            const year = selectedMonth.getFullYear();
            const month = selectedMonth.getMonth() + 1;
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const lastDay = new Date(year, month, 0).getDate();
            const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

            const res = await api.get(`/school/employee-attendance?startDate=${startDate}&endDate=${endDate}`);
            setAttendanceData(res.data);
        } catch (err) {
            console.error('Erro ao carregar frequência:', err);
        }
    };

    const getDaysInMonth = () => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Dias vazios no início
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Dias do mês
        for (let day = 1; day <= lastDay.getDate(); day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const hasAttendance = (date, employeeId) => {
        if (!date) return false;

        const dateStr = date.toISOString().split('T')[0];
        return attendanceData.some(record => {
            const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
            return recordDate === dateStr &&
                (selectedEmployee === 'all' || record.employee_id === parseInt(selectedEmployee));
        });
    };

    const previousMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
    };

    const handleEmployeeClick = (employeeId) => {
        if (employeeId === 'all') {
            setShowEmployeeDetails(false);
            setSelectedEmployeeData(null);
            return;
        }

        const employee = employees.find(e => e.id === parseInt(employeeId));
        if (!employee) return;

        // Calcular estatísticas do funcionário no mês atual
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const employeeRecords = attendanceData.filter(record =>
            record.employee_id === parseInt(employeeId)
        );

        const daysPresent = new Set(
            employeeRecords.map(record =>
                new Date(record.timestamp).toISOString().split('T')[0]
            )
        ).size;

        const attendanceRate = ((daysPresent / daysInMonth) * 100).toFixed(1);

        setSelectedEmployeeData({
            ...employee,
            daysPresent,
            daysInMonth,
            attendanceRate,
            records: employeeRecords
        });
        setShowEmployeeDetails(true);
    };

    const exportReport = () => {
        const monthName = selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        const days = getDaysInMonth().filter(d => d !== null);

        let csvContent = `Relatório de Frequência - Funcionários - ${monthName}\n\n`;
        csvContent += 'Funcionário,';
        csvContent += days.map(d => d.getDate()).join(',') + '\n';

        const employeesToExport = selectedEmployee === 'all'
            ? employees
            : employees.filter(e => e.id === parseInt(selectedEmployee));

        employeesToExport.forEach(employee => {
            csvContent += `${employee.name},`;
            csvContent += days.map(day => hasAttendance(day, employee.id) ? 'P' : 'F').join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `frequencia_funcionarios_${selectedMonth.getFullYear()}-${selectedMonth.getMonth() + 1}.csv`;
        link.click();
    };

    const days = getDaysInMonth();
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Filtrar funcionários por nome, cargo ou matrícula
    const filteredEmployees = employees.filter(emp => {
        if (!searchTerm) return true;

        const search = searchTerm.toLowerCase();
        const name = emp.name?.toLowerCase() || '';
        const role = emp.role?.toLowerCase() || '';
        const employeeId = emp.employee_id?.toLowerCase() || '';

        return name.includes(search) ||
            role.includes(search) ||
            employeeId.includes(search);
    });

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
                    📅 Frequência de Funcionários
                </h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Campo de Busca */}
                    <input
                        type="text"
                        className="input-field"
                        placeholder="🔍 Buscar por nome, cargo ou matrícula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            minWidth: '300px',
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '2px solid var(--glass-border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--text-primary)'
                        }}
                    />

                    {/* Dropdown de Seleção */}
                    <select
                        className="input-field"
                        value={selectedEmployee}
                        onChange={(e) => {
                            setSelectedEmployee(e.target.value);
                            handleEmployeeClick(e.target.value);
                        }}
                        style={{ padding: '0.75rem', minWidth: '200px' }}
                    >
                        <option value="all">Todos os Funcionários</option>
                        {filteredEmployees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} {emp.employee_id ? `(Mat: ${emp.employee_id})` : ''}
                            </option>
                        ))}
                    </select>

                    <button
                        className="btn"
                        onClick={exportReport}
                        style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Download size={18} />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Indicador de Resultados da Busca */}
            {searchTerm && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '0.9rem' }}>
                        🔍 <strong>{filteredEmployees.length}</strong> funcionário(s) encontrado(s) para "{searchTerm}"
                    </span>
                    <button
                        onClick={() => setSearchTerm('')}
                        style={{
                            marginLeft: 'auto',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Limpar
                    </button>
                </div>
            )}

            {/* Card de Detalhes do Funcionário */}
            {showEmployeeDetails && selectedEmployeeData && (
                <div className="glass-panel" style={{
                    padding: '2rem',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                    border: '2px solid rgba(59, 130, 246, 0.3)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                            👤 Detalhes do Funcionário
                        </h3>
                        <button
                            onClick={() => {
                                setShowEmployeeDetails(false);
                                setSelectedEmployee('all');
                            }}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                color: 'var(--text-primary)'
                            }}
                        >
                            ✕ Fechar
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'start' }}>
                        {/* Foto do Funcionário */}
                        <div style={{ textAlign: 'center' }}>
                            {selectedEmployeeData.photo_url ? (
                                <img
                                    src={selectedEmployeeData.photo_url}
                                    alt={selectedEmployeeData.name}
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid var(--accent-primary)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '4rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    border: '4px solid var(--accent-primary)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                                }}>
                                    {selectedEmployeeData.name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Informações do Funcionário */}
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                {selectedEmployeeData.name}
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                                {/* Cargo */}
                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        💼 Cargo
                                    </div>
                                    <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                        {selectedEmployeeData.role || 'Não informado'}
                                    </div>
                                </div>

                                {/* Matrícula */}
                                {selectedEmployeeData.employee_id && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            🔢 Matrícula
                                        </div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                            {selectedEmployeeData.employee_id}
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                {selectedEmployeeData.email && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            📧 Email
                                        </div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: '600', wordBreak: 'break-all' }}>
                                            {selectedEmployeeData.email}
                                        </div>
                                    </div>
                                )}

                                {/* Telefone */}
                                {selectedEmployeeData.phone && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            📱 Telefone
                                        </div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                            {selectedEmployeeData.phone}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Estatísticas de Frequência */}
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '12px',
                                border: '2px solid rgba(16, 185, 129, 0.3)'
                            }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                    📊 Frequência em {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981' }}>
                                            {selectedEmployeeData.daysPresent}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            Dias Presentes
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ef4444' }}>
                                            {selectedEmployeeData.daysInMonth - selectedEmployeeData.daysPresent}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            Dias Ausentes
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            fontSize: '2.5rem',
                                            fontWeight: '700',
                                            color: selectedEmployeeData.attendanceRate >= 90 ? '#10b981' :
                                                selectedEmployeeData.attendanceRate >= 75 ? '#f59e0b' : '#ef4444'
                                        }}>
                                            {selectedEmployeeData.attendanceRate}%
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            Taxa de Presença
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-panel" style={{ padding: '2rem' }}>
                {/* Month Navigator */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={previousMonth}
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem' }}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', textTransform: 'capitalize' }}>
                        {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h2>

                    <button
                        onClick={nextMonth}
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem' }}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                    {/* Week day headers */}
                    {weekDays.map(day => (
                        <div
                            key={day}
                            style={{
                                padding: '0.75rem',
                                textAlign: 'center',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                                fontSize: '0.875rem'
                            }}
                        >
                            {day}
                        </div>
                    ))}

                    {/* Calendar days */}
                    {days.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} />;
                        }

                        const isToday = date.toDateString() === new Date().toDateString();
                        const hasRecord = selectedEmployee === 'all'
                            ? hasAttendance(date, null)
                            : hasAttendance(date, parseInt(selectedEmployee));
                        const isFuture = date > new Date();

                        return (
                            <div
                                key={date.toISOString()}
                                style={{
                                    padding: '1rem',
                                    background: hasRecord
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : isFuture
                                            ? 'rgba(255,255,255,0.02)'
                                            : 'rgba(239, 68, 68, 0.1)',
                                    border: isToday ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    opacity: isFuture ? 0.5 : 1
                                }}
                            >
                                <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {date.getDate()}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {hasRecord ? '✓ Presente' : isFuture ? '-' : '✗ Ausente'}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '20px', height: '20px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.875rem' }}>Presente</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '20px', height: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.875rem' }}>Ausente</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '20px', height: '20px', border: '2px solid var(--accent-primary)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.875rem' }}>Hoje</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
