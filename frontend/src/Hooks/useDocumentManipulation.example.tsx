import { useDocumentManipulation } from './useDocumentManipulation';
import { useDocument } from '../services/documentService';

/**
 * Example usage of document manipulation hooks
 * This shows how to use the axios/tanstack document manipulation in a component
 */
export const DocumentManipulationExample = ({ documentId }: { documentId: number }) => {
  const { data: document } = useDocument(documentId);
  const {
    updateDocument,
    toggleActive,
    deleteDocument,
    updateStatus,
    updateCategory,
    updateTitle,
    isUpdating,
    isToggling,
    isDeleting,
    updateError,
  } = useDocumentManipulation();

  const handleUpdateTitle = async () => {
    try {
      await updateTitle(documentId, 'Nuevo título del documento');
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Failed to update document:', error);
    }
  };

  const handleToggleActive = async () => {
    try {
      await toggleActive(documentId);
      console.log('Document active status toggled');
    } catch (error) {
      console.error('Failed to toggle active status:', error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      // 1 = Vigente, 2 = Derogado, etc.
      await updateStatus(documentId, 2);
      console.log('Document status updated');
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleFullUpdate = async () => {
    try {
      await updateDocument(documentId, {
        titulo: 'Título actualizado',
        descripcion: 'Descripción actualizada',
        idcategoria: 1,
        idestadovigencia: 1,
        aplicacioninmediata: true,
        sedesids: [1, 2],
        carrerasids: [1],
      });
      console.log('Document fully updated');
    } catch (error) {
      console.error('Failed to update document:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      try {
        await deleteDocument(documentId);
        console.log('Document deleted successfully');
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  if (!document) {
    return <div>Cargando documento...</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">{document.titulo}</h3>
      
      <div className="space-y-3">
        <button
          onClick={handleUpdateTitle}
          disabled={isUpdating}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isUpdating ? 'Actualizando...' : 'Actualizar Título'}
        </button>

        <button
          onClick={handleToggleActive}
          disabled={isToggling}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isToggling ? 'Cambiando estado...' : `Cambiar a ${document.isactive ? 'Inactivo' : 'Activo'}`}
        </button>

        <button
          onClick={handleUpdateStatus}
          disabled={isUpdating}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {isUpdating ? 'Actualizando estado...' : 'Cambiar a Derogado'}
        </button>

        <button
          onClick={handleFullUpdate}
          disabled={isUpdating}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {isUpdating ? 'Actualizando...' : 'Actualización Completa'}
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar Documento'}
        </button>
      </div>

      {updateError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {updateError.message}
        </div>
      )}
    </div>
  );
};

/**
 * Example of using the raw hooks directly in a component
 */
export const DirectHooksExample = ({ documentId }: { documentId: number }) => {
  const updateDocument = useUpdateDocument();
  const toggleActive = useToggleDocumentActive();

  const handleQuickUpdate = () => {
    updateDocument.mutate(
      { id: documentId, data: { titulo: 'Nuevo título' } },
      {
        onSuccess: () => {
          console.log('Document updated successfully');
          // The query invalidation happens automatically
        },
        onError: (error) => {
          console.error('Update failed:', error);
        }
      }
    );
  };

  const handleQuickToggle = () => {
    toggleActive.mutate(documentId, {
      onSuccess: () => {
        console.log('Active status toggled');
      },
      onError: (error) => {
        console.error('Toggle failed:', error);
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleQuickUpdate}
        disabled={updateDocument.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {updateDocument.isPending ? 'Updating...' : 'Quick Update'}
      </button>

      <button
        onClick={handleQuickToggle}
        disabled={toggleActive.isPending}
        className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
      >
        {toggleActive.isPending ? 'Toggling...' : 'Quick Toggle'}
      </button>
    </div>
  );
};