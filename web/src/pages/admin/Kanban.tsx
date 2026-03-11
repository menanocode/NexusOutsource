import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';

const STAGES = ['APPLIED', 'SCREENING', 'SHORTLISTED', 'SUBMITTED', 'INTERVIEW', 'HIRED', 'REJECTED'];

export const Kanban = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const queryClient = useQueryClient();
  const [boardData, setBoardData] = useState<Record<string, any[]>>({});

  const { data: kanbanRes, isLoading } = useQuery({
    queryKey: ['kanban', jobId],
    queryFn: async () => {
      const { data } = await api.get('/applications/board/kanban', { params: { job_id: jobId } });
      return data.data.kanban;
    },
    enabled: !!jobId
  });

  useEffect(() => {
    if (kanbanRes) {
      // Initialize all stages even if empty
      const initial: Record<string, any[]> = {};
      STAGES.forEach(stage => {
        initial[stage] = kanbanRes[stage] || [];
      });
      setBoardData(initial);
    }
  }, [kanbanRes]);

  const updateStageMutation = useMutation({
    mutationFn: async ({ appId, stage }: { appId: string, stage: string }) => {
      await api.patch(`/applications/${appId}/stage`, { stage, notes: 'Moved via Kanban' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban', jobId] });
    }
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic update
    const sourceCol = [...boardData[source.droppableId]];
    const destCol = [...boardData[destination.droppableId]];
    const [movedItem] = sourceCol.splice(source.index, 1);
    
    // update state locally first
    movedItem.current_stage = destination.droppableId;
    destCol.splice(destination.index, 0, movedItem);

    setBoardData({
      ...boardData,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });

    if (source.droppableId !== destination.droppableId) {
      updateStageMutation.mutate({ appId: draggableId, stage: destination.droppableId });
    }
  };

  if (isLoading) return <div className="p-8">Loading Kanban...</div>;

  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Applicant Tracking System</h1>
      <div className="flex-1 flex overflow-x-auto space-x-4 pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {STAGES.map((stage) => (
            <div key={stage} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 min-w-[300px] w-80 flex flex-col">
              <h3 className="text-sm font-semibold uppercase text-slate-500 mb-4">{stage} ({boardData[stage]?.length || 0})</h3>
              
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-slate-200 dark:bg-slate-700/50' : ''} rounded-md transition-colors`}
                  >
                    {boardData[stage]?.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 mb-3 bg-white dark:bg-slate-900 rounded shadow-sm border ${snapshot.isDragging ? 'border-primary-500 shadow-xl scale-105' : 'border-slate-200 dark:border-slate-700'} transition-all`}
                          >
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{item.candidate?.full_name}</p>
                            <p className="text-xs text-slate-500 mt-1 truncate">{item.candidate?.email}</p>
                            
                            <div className="mt-3 flex justify-between items-center">
                              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                                Applied: {new Date(item.applied_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Kanban;
