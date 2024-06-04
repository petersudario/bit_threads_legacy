import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  async signUp(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLogged = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      });
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
    fileInput: HTMLInputElement
  ) {
    try {
      const imageFile = fileInput.files?.[0];
      if (!imageFile) {
        throw new Error('No file selected');
      }

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
        imageUrl: downloadURL,
      };

      // Add the data to Firestore
      await this.firebaseStore.collection('threads').add(data);

      console.log('Document added successfully.');
    } catch (error) {
      console.error('Error uploading image or adding document: ', error);
    }
  }

  getDocuments(): Observable<any[]> {
    return this.firebaseStore.collection('threads').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  is_owner(thread: any) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.uid === thread.userId;
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
