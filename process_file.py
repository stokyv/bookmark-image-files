import subprocess
import os
import zipfile
import os
# from PIL import Image
import os
import shutil
import sys
import json


def load_selected_images():
    file_path = os.path.join("d:\\", "Downloads", "selected_images.json")
    
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            selected_images = json.load(file)
        return selected_images
    else:
        print(f"File not found: {file_path}")
        return []

def extract_zip(zip_path):
    # Get the directory and filename from the zip path
    directory, filename = os.path.split(zip_path)
    
    # Get the name of the zip without the extension
    name, _ = os.path.splitext(filename)
    
    # Create the output directory with the same name as the zip
    # output_dir = os.path.join(directory, name)
    output_dir = os.path.join(directory, name)
    
    # Create the output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Extract the zip file
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    
    print(f"ZIP file extracted to: {output_dir}")
    return output_dir

def split_chapters(folder_path, bookmarked_images):
    #load all image files in folder
    image_files = load_all_images(folder_path)

    #loop
    all_chapters = []
    curr_list = []
    for item in image_files:
        if item in bookmarked_images:
            all_chapters.append(curr_list)        
            curr_list = [item]
        else:
            curr_list.append(item)
    if curr_list:
        all_chapters.append(curr_list)
    #return a list of lists
    return all_chapters

def load_all_images(folder_path):
    file_list = os.listdir(folder_path)

    # Filter out only the image files
    image_files = [f for f in file_list if f.endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'))]
    image_filepaths = [os.path.join(folder_path, f) for f in image_files]

    # print(image_filepaths)
    return image_filepaths

def split_chapters(folder_path, bookmarked_images):
    #load all image files in folder
    image_filepaths = load_all_images(folder_path)

    #loop
    all_chapters = []
    #add first image to current list
    curr_list = [image_filepaths[0]]

    for item in image_filepaths[1:]:
        if item in bookmarked_images:
            all_chapters.append(curr_list)        
            curr_list = [item]
        else:
            curr_list.append(item)
    if curr_list:
        all_chapters.append(curr_list)
    #return a list of lists
    return all_chapters

def create_new_folder(image_folder, new_folder_name):
    # Create a path for the new folder
    new_folder_path = os.path.join(os.getcwd(), image_folder, new_folder_name) 
    os.mkdir(new_folder_path)
    print(f"Folder '{new_folder_name}' created successfully.")
    return new_folder_path

def move_files(file_list, dest_folder):
    # make sure file_list is a list of relative file paths in the image folder
    # make sure dest_folder already exists in image_foldre
    # Define the list of filenames to move
    # filenames = ["file1.txt", "file2.txt", "file3.txt"]  # Example list of filenames

    # Define the destination folder
    # dest_folder = "f1"

    # Move each file to the destination folder
    for filename in file_list:
        # Check if the file exists
        if os.path.exists(filename):
            # Move the file to the destination folder
            shutil.move(filename, dest_folder)
            print(f"Moved '{filename}' to '{dest_folder}'")
        else:
            print(f"File '{filename}' does not exist.")

def convert_to_relative_filepaths(image_folder, file_list):
    for i in range(len(file_list)):
        item = file_list[i]
        if os.path.basename(item) == item:
            relative_filepath = os.path.join(image_folder, item)
            file_list[i] = relative_filepath
    return file_list
          
def main():
    print("Processing bookmarked files...")
    if len(sys.argv) < 2:
        print("Please provide at least one argument.")        
        return
    filename = sys.argv[1]
    # image_folder = extract_zip(filename)
    image_folder = 'ch26'
    selected_images_list = load_selected_images()
    bookmarked_images = selected_images_list
    convert_to_relative_filepaths(image_folder, bookmarked_images)
    chapters = split_chapters(image_folder, bookmarked_images)

    chapter_index = 0
    for chapter in chapters:
        #create a new folder for each chapter
        chapter_folder = f"{image_folder}-story-{chapter_index}"
        chapter_index += 1
        new_folder_path = create_new_folder(image_folder, chapter_folder)    
        #move files into folder
        move_files(chapter, new_folder_path)


if __name__ == "__main__":
    main()
    

