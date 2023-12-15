import csv
import re
import nltk
from nltk.tag import pos_tag
from nltk.corpus import stopwords
nltk.download('stopwords')
stop = set(stopwords.words('english'))

### Recreating the sentence
def Recreate(text):
	word=" ".join(text)
	return word


def Cleaning(text):
    text_punctuation_removed=remove_punctuation(text)
    #text_stopword_removed=remove_stopwords(text_punctuation_removed)
    text_unnegated=negation_handling(text_punctuation_removed)
    text_descriptive=descriptive_words(text_unnegated)
    text_stemmed=Stemming(text_descriptive)
    final_text=Recreate(text_stemmed)
    return final_text

### Stemming of Words
from nltk.stem.porter import PorterStemmer
st=PorterStemmer()#reduces word to base form, READ MORE ABOUT THIS (coming, came, will come)
def Stemming(text):
	stemmed_words=[st.stem(word) for word in text] 
	return stemmed_words

#removes undescriptive words from list
def descriptive_words(words):
    meaningful_words=[]    
    tags=['VB','VBP','VBD','VBG','VBN','JJ','JJR','JJS','RB','RBR','RBS','UH',"NN",'NNP']    
    tagged_word=pos_tag(words)
    for word in tagged_word:            
        if word[1] in tags:
            meaningful_words.append(word[0])
    return meaningful_words 


### Remove StopWords
def remove_stopwords(text):
	# modified_word_list=[word for word in text if word not in stop]
    return [word for word in text if word not in stop] # modified word list


### Remove Punctuations and change words to lower case
def remove_punctuation(text):
    words = [word.lower() for word in text.split()]
    words = [w for word in words for w in re.sub(r'[^\w\s]','',word).split()]
    return words

def negation_handling(words):
    counter=False    
    wlist=[]    
    negations=["no","not","cant","cannot","never","less","without","barely","hardly","rarely","no","not","noway","didnt"]
    #for words in wordlist:       
    for i,j in enumerate(words):                           
            if j in negations and i<len(words)-1:             
                wlist.append(str(words[i]+'-'+words[i+1]))
                counter=True
            else:
                if counter is False:                
                    wlist.append(words[i])
                else:
                    counter=False
    return wlist

#finds all the words that exist without repeats, also removes punctuationa and stopwords
def find_unique_words(inputed_phrase):
    phrase = set(negation_handling(remove_stopwords(remove_punctuation(inputed_phrase))))
    return phrase

## opens inputed data file of phrases and parses through to find the count of unique words 
# and words that are relavent. creates a new csv of which displays the words and their count. 
# @return: list of dictionary which includes word, count.
# imported: str, location of input data
# outported: location and name of final results, do not include file type, program automatically makes it a csv.
def save_data_as_count_csv(imported, outported):
    all_words=[]
    print('UPDATE: finding all unique words and their count...')

    with open(imported, 'r', newline='') as csvfile:
        csv_reader = csv.reader(csvfile)
        for row in csv_reader:
            col = find_unique_words(row[0])
            for each in col:
                all_words.append(each)

    #print(all_words)
    print('UPDATE: all words found.')

    words_counted = []
    words = []

    for word in all_words:
        if( word not in words ):
            words.append(word)
            words_counted.append({'word':word, 'count': 1})
        else:
            for dictionary in words_counted:
                if(word == dictionary['word']):
                    dictionary['count']+=1

    csvfile.close()
    print('UPDATE: all words counted.')

    # for each in words_counted:
    #     print(each['word'], ":", each['count'])

    with open(outported+'.csv', 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['WORD']+['WORD COUNT'])
        for each in words_counted:
            wordy=each['word']
            # wordNew = [wordy]
            #print(wordNew)
            csv_writer.writerow([str(wordy)]+[str(each['count'])])

    print('UPDATE: all important unique words saved with their count to the file '+ outported+'.')
    csvfile.close()
    return words_counted

if __name__ == "__main__":
    save_data_as_count_csv('naive_bayes/data.csv', 'naive_bayes/data_counted')
