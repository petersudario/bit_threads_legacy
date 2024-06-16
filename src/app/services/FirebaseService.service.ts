import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  isLogged = false;
  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseStore: AngularFirestore,
    public firebaseStorage: AngularFireStorage
  ) {}

  async signIn(email: string, password: string) {
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLogged = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      });
  }

  async signUp(email: string, password: string, username: string) {
    const data = {
      username: username,
      email: email,
      profile_picture: '',
    };
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLogged = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      });

    await this.firebaseStore.collection('user_info').add(data);
  }

  async getUser(): Promise<string> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    console.log(email);

    try {
      const querySnapshot = await this.firebaseStore.collection('user_info', ref => ref.where('email', '==', email)).get().toPromise();
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        const username = data['username'];
        console.log(username);
        return username;
      } else {
        return '';
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      throw error; // Rethrow the error to handle it in the calling code if needed
    }
  }

  async logout() {
    await this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }

  async addDocument(
    username: string,
    postTitle: string,
    date: Date,
    postText: string,
    fileInput: HTMLInputElement | null
  ) {
    try {
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const fileContent = await this.readFileContent(imageFile);

        const uploadedFile = new File([fileContent], imageFile.name, {
          type: imageFile.type,
        });

        const storageRef = this.firebaseStorage.ref('');
        const imageRef = storageRef.child(uploadedFile.name);
        const snapshot = await imageRef.put(uploadedFile);
        const downloadURL = await snapshot.ref.getDownloadURL();

        const data = {
          username: username,
          postTitle: postTitle,
          date: date,
          postText: postText,
          imageUrl: downloadURL ? downloadURL : '',
        };

        await this.firebaseStore.collection('threads').add(data);
      } else {
        const data = {
          username: username,
          postTitle: postTitle,
          date: date,
          postText: postText,
          imageUrl: '',
        };

        await this.firebaseStore.collection('threads').add(data);
      }
    } catch (error) {
      console.error('Error uploading image or adding document: ', error);
    }
  }

  async updateDocument(
    id: string,
    data: any,
    fileInput: HTMLInputElement | null
  ) {
    try {
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const fileContent = await this.readFileContent(imageFile);

        const uploadedFile = new File([fileContent], imageFile.name, {
          type: imageFile.type,
        });

        const storageRef = this.firebaseStorage.ref('');
        const imageRef = storageRef.child(uploadedFile.name);
        const snapshot = await imageRef.put(uploadedFile);
        const downloadURL = await snapshot.ref.getDownloadURL();
        data.imageUrl = downloadURL ? downloadURL : '';
      } else {
        data.imageUrl = '';
      }
      await this.firebaseStore.collection('threads').doc(id).update(data);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }

  async deleteDocument(id: string) {
    try {
      await this.firebaseStore.collection('threads').doc(id).delete();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }

  getDocuments(): Observable<any[]> {
    return this.firebaseStore
      .collection('threads')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  readFileContent(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
