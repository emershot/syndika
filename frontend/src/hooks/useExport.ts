import { useCallback } from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Ticket, Reservation, Announcement } from '@/types/condominium';

// Type for jsPDF with autoTable extension
interface jsPDFWithTable extends jsPDF {
  autoTable: (options: Record<string, unknown>) => jsPDFWithTable;
}

export function useExport() {
  const exportToCSV = useCallback((data: Record<string, unknown>[], filename: string) => {
    try {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    }
  }, []);

  const exportToPDF = useCallback((data: Record<string, unknown>[], filename: string, columns: Array<{ header: string; accessor: string }>) => {
    try {
      const pdf = new jsPDF() as jsPDFWithTable;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      // Header
      pdf.setFontSize(16);
      pdf.text(filename, margin, margin + 5);
      
      // Date
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}`, margin, margin + 15);
      
      // Table
      const tableData: unknown[][] = [];
      
      // Header row
      const headerRow = columns.map(col => col.header);
      tableData.push(headerRow);
      
      // Data rows
      data.forEach(row => {
        const rowData = columns.map(col => {
          const value = row[col.accessor];
          if (typeof value === 'object' && value instanceof Date) {
            return value.toLocaleDateString('pt-BR');
          }
          return String(value || '');
        });
        tableData.push(rowData);
      });
      
      // Add table
      pdf.autoTable({
        head: [tableData[0] as string[]],
        body: tableData.slice(1) as string[][],
        startY: margin + 20,
        margin: { top: margin, right: margin, bottom: margin, left: margin },
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 244, 248],
        },
      });
      
      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - margin + 5,
          { align: 'center' }
        );
      }
      
      pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  }, []);

  const exportTicketsToCSV = useCallback((tickets: Ticket[]) => {
    const data = tickets.map(ticket => ({
      ID: ticket.id,
      Título: ticket.title,
      Descrição: ticket.description,
      Categoria: ticket.category,
      Prioridade: ticket.priority,
      Status: ticket.status,
      Localização: ticket.location,
      'Criado por': ticket.createdByName,
      'Atribuído para': ticket.assignedToName || '-',
      'Criado em': new Date(ticket.createdAt).toLocaleDateString('pt-BR'),
      'Atualizado em': new Date(ticket.updatedAt).toLocaleDateString('pt-BR'),
    }));
    
    exportToCSV(data, 'chamados');
  }, [exportToCSV]);

  const exportTicketsToPDF = useCallback((tickets: Ticket[]) => {
    const data = tickets.map(ticket => ({
      ID: ticket.id.substring(0, 8),
      Título: ticket.title.substring(0, 30),
      Categoria: ticket.category,
      Prioridade: ticket.priority,
      Status: ticket.status,
      'Criado por': ticket.createdByName,
      'Criado em': new Date(ticket.createdAt).toLocaleDateString('pt-BR'),
    }));
    
    const columns = [
      { header: 'ID', accessor: 'ID' },
      { header: 'Título', accessor: 'Título' },
      { header: 'Categoria', accessor: 'Categoria' },
      { header: 'Prioridade', accessor: 'Prioridade' },
      { header: 'Status', accessor: 'Status' },
      { header: 'Criado por', accessor: 'Criado por' },
      { header: 'Criado em', accessor: 'Criado em' },
    ];
    
    exportToPDF(data, 'Relatório de Chamados', columns);
  }, [exportToPDF]);

  const exportReservationsToCSV = useCallback((reservations: Reservation[]) => {
    const data = reservations.map(reservation => ({
      ID: reservation.id,
      'Área Comum': reservation.commonAreaName,
      'Morador': reservation.requestedByName,
      'Data': new Date(reservation.date).toLocaleDateString('pt-BR'),
      'Hora Início': reservation.startTime,
      'Hora Fim': reservation.endTime,
      'Status': reservation.status,
      'Criado em': new Date(reservation.createdAt).toLocaleDateString('pt-BR'),
    }));
    
    exportToCSV(data, 'reservas');
  }, [exportToCSV]);

  const exportAnnouncementsToCSV = useCallback((announcements: Announcement[]) => {
    const data = announcements.map(announcement => ({
      ID: announcement.id,
      Título: announcement.title,
      Conteúdo: announcement.content.substring(0, 50) + '...',
      Tipo: announcement.type,
      Autor: announcement.authorName,
      'Criado em': new Date(announcement.createdAt).toLocaleDateString('pt-BR'),
    }));
    
    exportToCSV(data, 'avisos');
  }, [exportToCSV]);

  return {
    exportToCSV,
    exportToPDF,
    exportTicketsToCSV,
    exportTicketsToPDF,
    exportReservationsToCSV,
    exportAnnouncementsToCSV,
  };
}
