const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de pergunta e respostas', () => {
  modelo.cadastrar_pergunta('Qual a capital da França?');
  const perguntas = modelo.listar_perguntas();
  const id_pergunta = perguntas[0].id_pergunta;
  modelo.cadastrar_resposta(id_pergunta, 'Paris');
  modelo.cadastrar_resposta(id_pergunta, 'Lyon (acho)');

  const pergunta_atualizada = modelo.obter_pergunta(id_pergunta);
  expect(pergunta_atualizada.num_respostas).toBe(2);
  expect(pergunta_atualizada.respostas.length).toBe(2);
  expect(pergunta_atualizada.respostas[0].texto).toBe('Paris');
  expect(pergunta_atualizada.respostas[1].texto).toBe('Lyon (acho)');


});

test('Testando obter_pergunta com id inexistente', () => {
  const pergunta = modelo.obter_pergunta(999); // ID inexistente
  expect(pergunta).toBeNull();
});
