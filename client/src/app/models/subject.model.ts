export class Subject {

    id?: number;
    title?: string;
    description?: string;
    createdAt?: Date;
    updateAt?: Date;
  
    constructor(
      id: number = 0, 
      title: string = "", 
      description: string = "", 
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
    }

    public static maps(data): Subject[] {

      let subjects: Subject[] = [];

      for (let index = 0; index < data.length; index++) {
        let subject = new Subject();

        subject.id = data[index].id;
        subject.title = data[index].title;
        subject.description = data[index].description;
        subject.createdAt = data[index].createdAt;
        subject.updateAt = data[index].updateAt;

        subjects.push(subject);
      }

      return subjects;
    }

    public static map(data): Subject {

      let subject: Subject = new Subject();

      subject.id = data.id;
      subject.title = data.title;
      subject.description = data.description;
      subject.createdAt = data.createdAt;
      subject.updateAt = data.updateAt;

      return subject;
    }
  }