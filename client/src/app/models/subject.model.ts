export class Subject {

    id?: number;
    title?: string;
    description?: string;
    url?: string;
    contributors?: number;
    texts?: number;
    createdAt?: Date;
    updatedAt?: Date;
  
    constructor(
      id: number = 0, 
      title: string = "", 
      description: string = "",
      url: string = "",
      contributors: number = 0,
      texts: number = 0
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.url = url;
      this.contributors = contributors;
      this.texts = texts;
    }

    public static maps(data): Subject[] {

      let subjects: Subject[] = [];

      for (let index = 0; index < data.length; index++) {
        let subject = new Subject();

        subject.id = data[index].id;
        subject.title = data[index].title;
        subject.description = data[index].description;
        subject.url = data[index].url;
        subject.createdAt = data[index].createdAt;
        subject.updatedAt = data[index].updatedAt;
        subject.contributors = data[index].contributors;
        subject.texts = data[index].texts;
        
        subjects.push(subject);
      }

      return subjects;
    }

    public static map(data): Subject {

      let subject: Subject = new Subject();

      subject.id = data.id;
      subject.title = data.title;
      subject.description = data.description;
      subject.url = data.url;
      subject.createdAt = data.createdAt;
      subject.updatedAt = data.updatedAt;
      subject.contributors = data.contributors;
      subject.texts = data.texts;

      return subject;
    }
  }