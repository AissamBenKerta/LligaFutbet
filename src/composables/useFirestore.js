import { ref } from 'vue';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestore() {
  const loading = ref(false);
  const error = ref(null);

  // Obtener todos los documentos de una colección
  const getCollection = async (collectionName) => {
    loading.value = true;
    error.value = null;
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (err) {
      error.value = err.message;
      console.error('Error obteniendo colección:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Obtener un documento específico
  const getDocument = async (collectionName, documentId) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Documento no encontrado');
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error obteniendo documento:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Agregar un nuevo documento
  const addDocument = async (collectionName, data) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (err) {
      error.value = err.message;
      console.error('Error agregando documento:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar un documento
  const updateDocument = async (collectionName, documentId, data) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
      return true;
    } catch (err) {
      error.value = err.message;
      console.error('Error actualizando documento:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar un documento
  const deleteDocument = async (collectionName, documentId) => {
    loading.value = true;
    error.value = null;
    try {
      await deleteDoc(doc(db, collectionName, documentId));
      return true;
    } catch (err) {
      error.value = err.message;
      console.error('Error eliminando documento:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };
  const getCollectionByDivision = async (collectionName, division) => {
  loading.value = true;
  try {
    const colRef = collection(db, collectionName);
    // division es number (1 o 2)
    const q = query(colRef, where('division', '==', Number(division)));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return docs;
  } catch (error) {
    console.error('Error:', error);
    return [];
  } finally {
    loading.value = false;
  }
};

return {
  loading,
  getCollection,
  getCollectionByDivision, // <-- Añadir
  addDocument,
  updateDocument,
  deleteDocument
};

}
