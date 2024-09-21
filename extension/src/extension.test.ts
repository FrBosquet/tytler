import { it } from "node:test";
import { getReplacement } from "./extension.lib";

describe('replacement', () => {
  it('is defined', () => {
    expect(getReplacement).toBeDefined();
  });

  it('returns the expected without selected text', () => {
    const input = { contextText: '            Tus invitaciones, sin esfuerzo', selectedText: '' };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`{t('key->Tus invitaciones, sin esfuerzo')}`);
  });

  it('returns the expected with selected text', () => {
    const input = { contextText: '            Tus invitaciones, sin esfuerzo', selectedText: 'nvitaciones, sin es' };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`{t('key->nvitaciones, sin es')}`);
  });

  it('unwraps the text from the tags', () => {
    const input = { contextText: '              <SignInButton mode="modal">Inicia sesión</SignInButton>', selectedText: '' };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`<SignInButton mode="modal">{t('key->Inicia sesión')}</SignInButton>`);
  });

  it('translates text outside jsx', () => {
    const input = { contextText: "  const a = 'hola que pasa'", selectedText: "'hola que pasa" };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`const a = t('key->hola que pasa')`);
  });

  it('translates text outside jsx', () => {
    const input = { contextText: "  const a = 'hola que pasa'", selectedText: "hola que pasa'" };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`const a = t('key->hola que pasa')`);
  });

  it('translates text outside jsx', () => {
    const input = { contextText: "  const a = 'hola que pasa'", selectedText: "hola que pasa" };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`const a = t('key->hola que pasa')`);
  });

  it('translates text outside jsx', () => {
    const input = { contextText: "  const a = 'hola que pasa'", selectedText: "'hola que pasa'" };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`const a = t('key->hola que pasa')`);
  });

  it('multiline, combines in a single line', () => {
    const input = { contextText: `            Gestione las invitaciones de su día especial con nuestra completa`, selectedText: 'Gestione las invitaciones de su día especial con nuestra completa\n      aplicación de reserva de bodas.' };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`{t('key->Gestione las invitaciones de su día especial con nuestra completa aplicación de reserva de bodas.')}`);
  });

  it('handles links', () => {
    const input = { contextText: '              <Link href="/private">Crea tu invitación ahora</Link>', selectedText: 'Crea tu invitación ahora' };

    expect(getReplacement('key', input.selectedText, input.contextText)).toBe(`<Link href="/private">{t('test->Crea tu invitación ahora')}</Link>`);

  });
});