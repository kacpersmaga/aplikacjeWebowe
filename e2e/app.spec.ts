import { test, expect, Page } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Czyści localStorage i przeładowuje stronę – każdy test zaczyna od czystego stanu. */
async function freshStart(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

/** Tworzy projekt i zwraca jego nazwę. */
async function createProject(page: Page, name = 'Projekt Testowy', description = 'Opis testowy') {
  await page.getByTestId('btn-new-project').click();
  await page.locator('#name').fill(name);
  await page.locator('#description').fill(description);
  await page.getByTestId('btn-submit-project').click();
}

/** Aktywuje pierwszy projekt na liście i przechodzi do historyjek. */
async function selectProjectAndGoToStories(page: Page) {
  await page.getByTestId('btn-select-project').first().click();
  await page.getByTestId('nav-stories').click();
}

/** Tworzy historyjkę (wymaga aktywnego projektu i widoku historyjek). */
async function createStory(page: Page, name = 'Historyjka Testowa', description = 'Opis historyjki') {
  await page.getByTestId('btn-new-story').click();
  await page.locator('#name').fill(name);
  await page.locator('#description').fill(description);
  await page.getByTestId('btn-submit-story').click();
}

/** Przechodzi do zadań pierwszej historyjki. */
async function openFirstStoryTasks(page: Page) {
  await page.getByTestId('btn-open-story').first().click();
}

/** Tworzy zadanie (wymaga widoku zadań). */
async function createTask(page: Page, name = 'Zadanie Testowe', description = 'Opis zadania') {
  await page.getByTestId('btn-new-task').click();
  await page.locator('#name').fill(name);
  await page.locator('#description').fill(description);
  await page.locator('#estimatedTime').fill('3');
  await page.getByTestId('btn-submit-task').click();
}

// ─── Testy ──────────────────────────────────────────────────────────────────

test.describe('ManageMe – testy E2E', () => {

  // ── 1. Tworzenie ────────────────────────────────────────────────────────

  test('Tworzenie projektu', async ({ page }) => {
    await freshStart(page);

    await createProject(page, 'Mój Projekt', 'Opis mojego projektu');

    // Karta projektu powinna być widoczna
    const card = page.getByTestId('project-card').first();
    await expect(card).toBeVisible();
    await expect(card).toContainText('Mój Projekt');
  });

  test('Tworzenie historyjki w projekcie', async ({ page }) => {
    await freshStart(page);

    await createProject(page);
    await selectProjectAndGoToStories(page);
    await createStory(page, 'Logowanie użytkownika', 'Jako użytkownik chcę się zalogować');

    // Karta historyjki powinna być widoczna
    const card = page.getByTestId('story-card').first();
    await expect(card).toBeVisible();
    await expect(card).toContainText('Logowanie użytkownika');
  });

  test('Tworzenie zadania w historyjce', async ({ page }) => {
    await freshStart(page);

    await createProject(page);
    await selectProjectAndGoToStories(page);
    await createStory(page);
    await openFirstStoryTasks(page);
    await createTask(page, 'Implementacja formularza', 'Formularz logowania z walidacją');

    // Karta zadania powinna pojawić się w kolumnie "todo"
    const card = page.getByTestId('task-card').first();
    await expect(card).toBeVisible();
    await expect(card).toContainText('Implementacja formularza');
  });

  // ── 2. Zmiana statusu zadania ────────────────────────────────────────────

  test('Zmiana statusu zadania: todo → doing → done', async ({ page }) => {
    await freshStart(page);

    await createProject(page);
    await selectProjectAndGoToStories(page);
    await createStory(page);
    await openFirstStoryTasks(page);
    await createTask(page, 'Zadanie do wykonania', 'Test zmiany statusu');

    // Kliknięcie w kartę otwiera szczegóły – status to "todo"
    await page.getByTestId('task-card').first().click();

    // Przypisujemy pierwszego dostępnego użytkownika → status zmienia się na "doing"
    await page.getByTestId('btn-assign-user').first().click();

    // Teraz powinien być widoczny przycisk "Oznacz jako zakończone"
    await expect(page.getByTestId('btn-complete-task')).toBeVisible();

    // Klikamy i zadanie przechodzi do "done"
    await page.getByTestId('btn-complete-task').click();

    // Po zamknięciu modala – karta powinna być w kolumnie "done"
    const doneColumn = page.locator('[data-status="done"]');
    await expect(doneColumn.getByTestId('task-card')).toBeVisible();
  });

  // ── 3. Edycja ───────────────────────────────────────────────────────────

  test('Edycja projektu', async ({ page }) => {
    await freshStart(page);

    await createProject(page, 'Stara Nazwa', 'Stary opis');

    // Klikamy edytuj na pierwszej karcie
    await page.getByTestId('btn-edit-project').first().click();

    // Zmieniamy nazwę
    await page.locator('#name').fill('Nowa Nazwa Projektu');
    await page.getByTestId('btn-submit-project').click();

    // Karta powinna pokazywać zaktualizowaną nazwę
    await expect(page.getByTestId('project-card').first()).toContainText('Nowa Nazwa Projektu');
  });

  test('Edycja historyjki', async ({ page }) => {
    await freshStart(page);

    await createProject(page);
    await selectProjectAndGoToStories(page);
    await createStory(page, 'Stara Historyjka', 'Stary opis historyjki');

    // Najeżdżamy na kartę, by pokazać przyciski akcji, i klikamy edytuj
    const storyCard = page.getByTestId('story-card').first();
    await storyCard.hover();
    await page.getByTestId('btn-edit-story').first().click();

    // Zmieniamy tytuł historyjki
    await page.locator('#name').fill('Zaktualizowana Historyjka');
    await page.getByTestId('btn-submit-story').click();

    // Karta powinna pokazywać nową nazwę
    await expect(page.getByTestId('story-card').first()).toContainText('Zaktualizowana Historyjka');
  });

  test('Edycja zadania', async ({ page }) => {
    await freshStart(page);

    await createProject(page);
    await selectProjectAndGoToStories(page);
    await createStory(page);
    await openFirstStoryTasks(page);
    await createTask(page, 'Stare Zadanie', 'Stary opis zadania');

    // Najeżdżamy na kartę, by pokazać przyciski (edycja dostępna tylko dla "todo")
    const taskCard = page.getByTestId('task-card').first();
    await taskCard.hover();
    await page.getByTestId('btn-edit-task').first().click();

    // Zmieniamy nazwę zadania
    await page.locator('#name').fill('Zaktualizowane Zadanie');
    await page.getByTestId('btn-submit-task').click();

    // Karta powinna pokazywać nową nazwę
    await expect(page.getByTestId('task-card').first()).toContainText('Zaktualizowane Zadanie');
  });

  // ── 4. Usuwanie ─────────────────────────────────────────────────────────

  test('Usuwanie zadania', async ({ page }) => {
    await freshStart(page);

    await createProject(page);
    await selectProjectAndGoToStories(page);
    await createStory(page);
    await openFirstStoryTasks(page);
    await createTask(page, 'Zadanie do usunięcia', 'Opis');

    // Przed usunięciem – zadanie istnieje
    await expect(page.getByTestId('task-card')).toHaveCount(1);

    // Najeżdżamy i usuwamy
    await page.getByTestId('task-card').first().hover();
    await page.getByTestId('btn-delete-task').first().click();

    // Po usunięciu – brak kart zadań
    await expect(page.getByTestId('task-card')).toHaveCount(0);
  });

  test('Usuwanie historyjki', async ({ page }) => {
    await freshStart(page);

    await createProject(page);
    await selectProjectAndGoToStories(page);
    await createStory(page, 'Historyjka do usunięcia', 'Opis');

    // Przed usunięciem – historyjka istnieje
    await expect(page.getByTestId('story-card')).toHaveCount(1);

    // Najeżdżamy i usuwamy
    await page.getByTestId('story-card').first().hover();
    await page.getByTestId('btn-delete-story').first().click();

    // Po usunięciu – brak kart historyjek
    await expect(page.getByTestId('story-card')).toHaveCount(0);
  });

  test('Usuwanie projektu', async ({ page }) => {
    await freshStart(page);

    await createProject(page, 'Projekt do usunięcia', 'Opis');

    // Przed usunięciem – projekt istnieje
    await expect(page.getByTestId('project-card')).toHaveCount(1);

    // Usuwamy projekt
    await page.getByTestId('btn-delete-project').first().click();

    // Po usunięciu – brak kart projektów
    await expect(page.getByTestId('project-card')).toHaveCount(0);
  });

});
