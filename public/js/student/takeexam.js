const exam = {
    title: "test",
    id: '1122222',
    teacher_id: '1232',
    duration: 60,
    description: 'just take the test',
    questions: [
        {
            type:'QCM',
            number: 1,
            answer: null,
            enonce: '1+1',
            options:[{option: '1', case:false},{option:'3', case:false},{option:'2', case:true}]
        },
        {
            type:'direct',
            number: 2,
            enonce: '1-1',
            answer: '0',
            options: [],
        }
    ]
}