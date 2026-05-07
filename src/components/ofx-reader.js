// Função para ler o conteúdo de um arquivo como texto
function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event?.target?.result ?? "");
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
}

// Função para normalizar o nome do beneficiário
function normalizeNameText(name) {
  const normalizedName = String(name ?? '').replace(/\s+/g, ' ').trim();

  if (!normalizedName) {
    return '';
  }

  const nameParts = normalizedName.split(' ');
  const lastPart = nameParts[nameParts.length - 1];

  if (/^(bra|brasil|br)$/i.test(lastPart)) {
    const preposition = nameParts[nameParts.length - 3]?.toLowerCase();
    const hasLocationSuffix = ['da', 'de', 'do', 'das', 'dos'].includes(preposition);

    if (nameParts.length >= 5 && hasLocationSuffix) {
      return nameParts.slice(0, -4).join(' ');
    }

    return nameParts.slice(0, -2).join(' ');
  }

  return normalizedName;
}

// Função para normalizar o conteúdo do arquivo OFX e extrair as transações
function normalizeOfxText(ofxText) {
  var idMatch = [];
  var dateMatch = [];
  var amountMatch = [];
  var nameMatch = [];
  var typeMatch = [];
  var memoMatch = [];

  const normalizedText = ofxText.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi) || [];

  normalizedText.map((transaction) => {
    idMatch.push(transaction.match(/<FITID>([^<]+)<\/FITID>/)[1]);
    dateMatch.push(transaction.match(/<DTPOSTED>(\d{8})<\/DTPOSTED>/)[1]);
    amountMatch.push(transaction.match(/<TRNAMT>(-?\d+\.\d{2})<\/TRNAMT>/)[1]);
    nameMatch.push(normalizeNameText(transaction.match(/<NAME>([^<]+)<\/NAME>/)[1]));
    memoMatch.push(transaction.match(/<MEMO>([^<]+)<\/MEMO>/)[1].split('"')[0].replace(/\s*:\s*$/, ''));
    if (transaction.match(/<TRNTYPE>([^<]+)<\/TRNTYPE>/)[1].toUpperCase() === 'CREDIT') {
      typeMatch.push(0);
    } else if (transaction.match(/<TRNTYPE>([^<]+)<\/TRNTYPE>/)[1].toUpperCase() === 'PAYMENT') {
      typeMatch.push(1);
    }
  });

  return { transaction: { id: idMatch, date: dateMatch, amount: amountMatch, name: nameMatch, type: typeMatch, memo: memoMatch } };
}

// Função principal que recebe o arquivo e o trata
export default async function ofxReader(file) {
  if (!file) {
    return [];
  }

  const ofxText = await readFileText(file);
  return normalizeOfxText(ofxText);
}