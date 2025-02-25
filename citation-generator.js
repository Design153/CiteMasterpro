// Citation Generator JavaScript Logic
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sourceDetails = document.getElementById('source-details');
    const citationStyle = document.getElementById('citationStyle');
    const generateCitationBtn = document.getElementById('generate-citation');
    const inTextCitationBtn = document.getElementById('in-text-citation-btn');
    const copyBtn = document.getElementById('copy-btn');
    const generatedCitation = document.getElementById('generated-citation');
    const citationOutput = document.getElementById('citation-output');
    const errorMessage = document.getElementById('error-message');
    const errorFeedback = document.getElementById('error-feedback');
    const inTextModal = document.getElementById('in-text-modal');
    const inTextInput = document.getElementById('in-text-input');
    const generateIntextSubmit = document.getElementById('generate-intext-submit');
    const inTextOutput = document.getElementById('in-text-output');
    const inTextClose = document.getElementById('in-text-close');

    // Citation style formats for references and in-text citations
    const citationStyles = {
        apa: {
            reference: (data) => `${data.author} (${data.year}). ${data.title}. ${data.publisher}${data.url ? `. Retrieved from ${data.url}` : ''}`,
            inText: (data) => `(${data.author.split(',')[0].trim()}, ${data.year})`
        },
        mla: {
            reference: (data) => `${data.author}. "${data.title}." ${data.publisher}, ${data.year}${data.url ? `, ${data.url}` : ''}`,
            inText: (data) => `(${data.author.split(',')[0].trim()} ${data.year})`
        },
        chicago: {
            reference: (data) => `${data.author}, "${data.title}," ${data.publisher}, ${data.year}${data.url ? `, ${data.url}` : ''}`,
            inText: (data) => `(${data.author.split(',')[0].trim()} ${data.year})`
        },
        harvard: {
            reference: (data) => `${data.author} (${data.year}) ${data.title}. ${data.publisher}${data.url ? `. Available at: ${data.url}` : ''}`,
            inText: (data) => `(${data.author.split(',')[0].trim()}, ${data.year})`
        },
        ieee: {
            reference: (data) => `[1] ${data.author}, "${data.title}," ${data.publisher}, ${data.year}${data.url ? `. [Online]. Available: ${data.url}` : ''}`,
            inText: (data) => `[1]`
        },
        vancouver: {
            reference: (data) => `${data.author}. ${data.title}. ${data.publisher}; ${data.year}${data.url ? `. Available from: ${data.url}` : ''}`,
            inText: (data) => `(1)`
        }
    };

    // Validate and parse input data
    function parseInput(data) {
        try {
            const parsed = JSON.parse(data);
            return {
                author: parsed.author || 'Unknown Author',
                title: parsed.title || 'Untitled',
                year: parsed.year || new Date().getFullYear(),
                publisher: parsed.publisher || 'Unknown Publisher',
                url: parsed.url || ''
            };
        } catch (e) {
            throw new Error('Invalid JSON format. Use: {"author": "Name", "title": "Title", "year": Number, "publisher": "Publisher", "url": "URL"}');
        }
    }

    // Check for errors in input
    function checkErrors(data) {
        try {
            const parsed = JSON.parse(data);
            if (!parsed.author || !parsed.author.trim()) return 'Author is required.';
            if (!parsed.title || !parsed.title.trim()) return 'Title is required.';
            if (!parsed.year || isNaN(parsed.year) || parsed.year < 1900 || parsed.year > new Date().getFullYear()) return 'Valid year is required.';
            return null;
        } catch (e) {
            return 'Invalid JSON format.';
        }
    }

    // Generate full citation (reference)
    function generateReference(data, style) {
        const parsedData = parseInput(data);
        const styleFunc = citationStyles[style]?.reference;
        if (!styleFunc) return 'Selected citation style not supported yet.';
        return styleFunc(parsedData);
    }

    // Generate in-text citation
    function generateInText(data, style) {
        const parsedData = parseInput(data);
        const styleFunc = citationStyles[style]?.inText;
        if (!styleFunc) return 'Selected citation style not supported yet.';
        return styleFunc(parsedData);
    }

    // Update preview for reference
    function updateReferencePreview() {
        const data = sourceDetails.value;
        const errors = checkErrors(data);
        if (errors) {
            errorFeedback.style.display = 'block';
            errorMessage.textContent = errors;
            citationOutput.style.display = 'none';
            return;
        }
        errorFeedback.style.display = 'none';
        const style = citationStyle.value;
        const citation = generateReference(data, style);
        generatedCitation.textContent = citation;
        citationOutput.style.display = 'block';
    }

    // Event Listeners

    // Real-time preview on input or style change
    sourceDetails.addEventListener('input', updateReferencePreview);
    citationStyle.addEventListener('change', updateReferencePreview);

    // Generate full citation (reference)
    generateCitationBtn.addEventListener('click', () => {
        const data = sourceDetails.value;
        const errors = checkErrors(data);
        if (errors) {
            errorFeedback.style.display = 'block';
            errorMessage.textContent = errors;
            citationOutput.style.display = 'none';
            return;
        }
        errorFeedback.style.display = 'none';
        const style = citationStyle.value;
        const citation = generateReference(data, style);
        generatedCitation.textContent = citation;
        citationOutput.style.display = 'block';
    });

    // Open in-text citation modal
    inTextCitationBtn.addEventListener('click', () => {
        inTextModal.style.display = 'block';
        inTextInput.value = '';
        inTextOutput.textContent = '';
    });

    // Generate in-text citation from modal
    generateIntextSubmit.addEventListener('click', () => {
        const data = sourceDetails.value;
        const errors = checkErrors(data);
        if (errors) {
            inTextOutput.textContent = 'Error: Please correct source details first.';
            return;
        }
        const style = citationStyle.value;
        const inText = generateInText(data, style);
        inTextOutput.textContent = `In-Text Citation: ${inText}`;
        generatedCitation.textContent = `${generateReference(data, style)}\n\nIn-Text: ${inText}`;
        citationOutput.style.display = 'block';
    });

    // Close in-text modal
    inTextClose.addEventListener('click', () => {
        inTextModal.style.display = 'none';
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const citation = generatedCitation.textContent;
        if (citation) {
            navigator.clipboard.writeText(citation).then(() => {
                alert('Citation copied to clipboard!');
            }).catch(err => {
                alert('Failed to copy: ' + err);
            });
        } else {
            alert('Generate a citation first!');
        }
    });

    // Initial setup
    updateReferencePreview();
});