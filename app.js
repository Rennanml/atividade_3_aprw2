import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const users = [];
const alunos = [
    { id: 1, nome: "João", ra: "12345", nota1: 7.0, nota2: 8.0 },
    { id: 2, nome: "Maria", ra: "67890", nota1: 6.0, nota2: 5.5 },
    { id: 3, nome: "Pedro", ra: "11223", nota1: 9.0, nota2: 7.5 },
    { id: 4, nome: "Ana", ra: "33445", nota1: 5.5, nota2: 6.0 },
    { id: 5, nome: "Lucas", ra: "55667", nota1: 8.5, nota2: 9.0 },
    { id: 6, nome: "Paula", ra: "77889", nota1: 7.5, nota2: 8.0 },
    { id: 7, nome: "Carlos", ra: "99001", nota1: 6.5, nota2: 6.0 },
    { id: 8, nome: "Juliana", ra: "22334", nota1: 8.0, nota2: 7.5 },
    { id: 9, nome: "Fernanda", ra: "44556", nota1: 9.5, nota2: 8.0 },
    { id: 10, nome: "Gabriel", ra: "66778", nota1: 7.0, nota2: 6.5 },
    { id: 11, nome: "Ricardo", ra: "88990", nota1: 5.0, nota2: 5.5 },
    { id: 12, nome: "Luana", ra: "10112", nota1: 8.0, nota2: 9.0 },
    { id: 13, nome: "Marcos", ra: "21314", nota1: 6.0, nota2: 7.0 },
    { id: 14, nome: "Sofia", ra: "41516", nota1: 7.5, nota2: 6.5 },
    { id: 15, nome: "Isabela", ra: "61718", nota1: 8.5, nota2: 9.5 },
    { id: 16, nome: "Diego", ra: "81920", nota1: 6.5, nota2: 7.5 },
    { id: 17, nome: "Carla", ra: "02122", nota1: 7.0, nota2: 8.5 },
    { id: 18, nome: "André", ra: "22324", nota1: 9.0, nota2: 8.0 },
    { id: 19, nome: "Beatriz", ra: "42526", nota1: 5.5, nota2: 6.0 },
    { id: 20, nome: "Vitor", ra: "62728", nota1: 7.5, nota2: 8.0 }
];


app.use(express.json());

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token inválido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const errorMessage =
                err.name === "TokenExpiredError"
                    ? "Token expirado."
                    : "Token inválido.";
            return res.status(403).json({ message: `Acesso negado. ${errorMessage}` });
        }

        req.user = user;
        next();
    });
};

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Usuário e senha são obrigatórios!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Credenciais inválidas!" });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.json({ 
        message: `Login efetuado pelo usuário ${user.username}`,
        jwt: token, });
});

app.get("/alunos", authenticateJWT, (req, res) => {
    res.json(alunos);
});

app.get("/alunos/medias", authenticateJWT, (req, res) => {
    const medias = alunos.map((aluno) => ({
        nome: aluno.nome,
        media: ((aluno.nota1 + aluno.nota2) / 2).toFixed(2),
    }));
    res.json(medias);
});

app.get("/alunos/aprovados", authenticateJWT, (req, res) => {
    const aprovados = alunos.map((aluno) => {
        const media = (aluno.nota1 + aluno.nota2) / 2;
        return { nome: aluno.nome, status: media >= 6 ? "Aprovado" : "Reprovado" };
    });
    res.json(aprovados);
});

app.get("/alunos/:id", authenticateJWT, (req, res) => {
    const aluno = alunos.find((a) => a.id === parseInt(req.params.id));
    if (!aluno) {
        return res.status(404).json({ message: "Aluno não encontrado!" });
    }
    res.json(aluno);
});

app.post("/alunos", authenticateJWT, (req, res) => {
    const { id, nome, ra, nota1, nota2 } = req.body;

    if (!id || !nome || !ra || nota1 == null || nota2 == null) {
        return res.status(400).json({ message: "Dados incompletos!" });
    }

    alunos.push({ id, nome, ra, nota1, nota2 });
    res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
});

app.put("/alunos/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const { nome, ra, nota1, nota2 } = req.body;

    const aluno = alunos.find((a) => a.id === parseInt(id));
    if (!aluno) {
        return res.status(404).json({ message: "Aluno não encontrado!" });
    }

    if (nome) aluno.nome = nome;
    if (ra) aluno.ra = ra;
    if (nota1 != null) aluno.nota1 = nota1;
    if (nota2 != null) aluno.nota2 = nota2;

    res.json({ message: "Aluno atualizado com sucesso!" });
});

app.delete("/alunos/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const index = alunos.findIndex((a) => a.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: "Aluno não encontrado!" });
    }
    alunos.splice(index, 1);
    res.json({ message: "Aluno deletado com sucesso!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
